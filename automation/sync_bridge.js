// Client Claude Code ↔ GUI Synchronization Bridge
// Enables real-time bidirectional sync between Claude Code planning and GUI interface

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const F = cfg.fields;

// Synchronous fetch initialization with fallback
let fetch;
try {
    // Try to use node-fetch if available
    fetch = require('node-fetch');
} catch (error) {
    // Fallback to native fetch (Node 18+) or use a stub
    if (typeof globalThis !== 'undefined' && globalThis.fetch) {
        fetch = globalThis.fetch;
    } else {
        console.warn('No fetch implementation found - async operations will fail');
        fetch = null;
    }
}

class ClaudeGUIBridge {
    constructor() {
        this.stateFile = '/tmp/client_planning_state.json';
        this.airtableSyncFile = path.join(__dirname, '../content/systematic-tracking/airtable-sync.json');
        this.currentState = {
            planning_session_id: null,
            content_records: [],
            last_updated: null,
            claude_changes: [],
            gui_changes: [],
            airtable_items: []  // Track Airtable items separately
        };
        
        this.loadState();
        this.startFileWatcher();
    }
    
    // Initialize new planning session
    startPlanningSession(sessionId = null) {
        this.currentState = {
            planning_session_id: sessionId || `session_${Date.now()}`,
            content_records: [],
            last_updated: new Date().toISOString(),
            claude_changes: [],
            gui_changes: []
        };
        
        this.saveState();
        console.log(`✅ Started planning session: ${this.currentState.planning_session_id}`);
        return this.currentState.planning_session_id;
    }
    
    // Add content from Claude Code planning with generation type and control
    async addContentFromClaude(contentArray, generationType = 'LOCAL', generateImmediately = false) {
        const processedRecords = [];
        
        for (let index = 0; index < contentArray.length; index++) {
            const content = contentArray[index];
            
            // Get real Content ID from Airtable for unified organization
            let contentId = null;
            let airtableRecordId = null;
            
            if (generationType === 'SYSTEMATIC' || content.useContentId === true) {
                try {
                    const airtableResponse = await this.getNextContentId(content);
                    contentId = airtableResponse.contentId;
                    airtableRecordId = airtableResponse.recordId;
                    console.log(`🆔 Assigned Content ID: ${contentId}`);
                } catch (error) {
                    console.log(`⚠️ Content ID assignment failed, using temporary ID`);
                    contentId = `temp_${Date.now()}_${index}`;
                }
            } else {
                contentId = `temp_${Date.now()}_${index}`;
            }
            
            // Enhance content with intelligent pest type and location detection
            const enhancedContent = this.enhanceContentData(content);
            
            const record = {
                id: contentId,
                contentId: contentId, // Store Content ID separately for easy access
                selected: true, // Default to selected
                order: this.currentState.content_records.length,
                source: 'claude',
                generationType: generationType, // LOCAL or SYSTEMATIC
                generationStatus: generationType === 'LOCAL' && !generateImmediately ? 'pending' : 'ready', // NEW: Track generation state
                localFilePath: null, // Will be set when MD file is created
                textContent: null, // NEW: Store actual text content for dashboard preview
                contentPreview: null, // NEW: First 200 chars for quick preview
                wordCount: 0, // NEW: Track content length
                googleDriveFolder: null, // Will be set when Google Drive workspace created
                googleDocsId: null, // Will be set when Google Doc created
                airtableRecordId: airtableRecordId, // Real Airtable record ID
                status: 'planned', // planned, draft, review, published
                // FIX 1: Map publicationDate to targetPublishDate for GUI compatibility
                targetPublishDate: enhancedContent.publicationDate || enhancedContent.targetPublishDate,
                target_publish_date: enhancedContent.publicationDate || enhancedContent.target_publish_date,
                // FIX 3: Map keywords to primaryKeyword for edit modal
                primaryKeyword: enhancedContent.keywords ? enhancedContent.keywords.split(',')[0].trim() : enhancedContent.primaryKeyword,
                ...enhancedContent,
                created_at: new Date().toISOString(),
                modified_at: new Date().toISOString()
            };
            
            // Create Google Drive workspace for systematic content
            if (generationType === 'SYSTEMATIC' && contentId && !contentId.startsWith('temp_')) {
                try {
                    const workspace = await this.createGoogleDriveWorkspace(contentId, content.contentType || 'Content');
                    record.googleDriveFolder = workspace.folderId;
                    record.googleDocsId = workspace.documentId;
                    console.log(`📁 Created Google Drive workspace for ${contentId}`);
                } catch (error) {
                    console.log(`⚠️ Google Drive workspace creation failed for ${contentId}`);
                }
            }
            
            // FIX 2: Always generate LOCAL content for better GUI integration
            if (generationType === 'LOCAL') {
                try {
                    console.log(`🚀 Generating LOCAL content for: ${record.description}`);
                    const filePath = this.createLocalMDFile(record.id);
                    if (filePath) {
                        const rawContent = await this.readLocalMDContent(filePath);
                        const cleanContent = this.extractCleanContentForAirtable(rawContent);
                        record.textContent = cleanContent;
                        record.contentPreview = this.createContentPreview(cleanContent);
                        record.wordCount = this.calculateWordCount(cleanContent);
                        record.localFilePath = filePath;
                        record.generationStatus = 'generated';
                        console.log(`✅ Generated LOCAL content: ${record.description} (${record.wordCount} words)`);
                    }
                } catch (error) {
                    console.log(`⚠️ LOCAL content generation failed for ${record.id}:`, error.message);
                    record.generationStatus = 'failed';
                }
            }
            
            // Handle legacy generateImmediately parameter for existing workflows
            if (generationType === 'LOCAL' && generateImmediately === false) {
                record.generationStatus = 'pending'; // Override for explicit non-generation requests
            }
            
            this.currentState.content_records.push(record);
            processedRecords.push(record);
        }
        
        this.currentState.last_updated = new Date().toISOString();
        this.currentState.claude_changes.push({
            action: 'add_content',
            count: contentArray.length,
            timestamp: new Date().toISOString()
        });
        
        this.saveState();
        console.log(`✅ Added ${contentArray.length} records from Claude Code`);
        return this.currentState.content_records;
    }
    
    // Update content from Claude Code (modify existing records)
    updateContentFromClaude(updates) {
        updates.forEach(update => {
            const recordIndex = this.currentState.content_records.findIndex(
                r => r.id === update.id || r.description === update.originalDescription
            );
            
            if (recordIndex !== -1) {
                this.currentState.content_records[recordIndex] = {
                    ...this.currentState.content_records[recordIndex],
                    ...update.changes,
                    modified_at: new Date().toISOString(),
                    source: 'claude'
                };
                
                console.log(`✅ Updated record: ${update.originalDescription || update.id}`);
            }
        });
        
        this.currentState.last_updated = new Date().toISOString();
        this.currentState.claude_changes.push({
            action: 'update_content',
            updates: updates.length,
            timestamp: new Date().toISOString()
        });
        
        this.saveState();
        return this.currentState.content_records;
    }
    
    // Remove content from Claude Code
    removeContentFromClaude(identifiers) {
        const removed = [];
        
        identifiers.forEach(identifier => {
            const recordIndex = this.currentState.content_records.findIndex(
                r => r.id === identifier || r.description === identifier
            );
            
            if (recordIndex !== -1) {
                removed.push(this.currentState.content_records[recordIndex]);
                this.currentState.content_records.splice(recordIndex, 1);
            }
        });
        
        // Reorder remaining records
        this.currentState.content_records.forEach((record, index) => {
            record.order = index;
        });
        
        this.currentState.last_updated = new Date().toISOString();
        this.currentState.claude_changes.push({
            action: 'remove_content',
            removed: removed.length,
            timestamp: new Date().toISOString()
        });
        
        this.saveState();
        console.log(`✅ Removed ${removed.length} records from Claude Code`);
        return this.currentState.content_records;
    }
    
    // Handle GUI changes (called by GUI interface)
    updateFromGUI(changes) {
        changes.forEach(change => {
            switch (change.action) {
                case 'update_field':
                    this.updateFieldFromGUI(change.id, change.field, change.value);
                    break;
                    
                case 'reorder':
                    this.reorderFromGUI(change.fromIndex, change.toIndex);
                    break;
                    
                case 'toggle_selection':
                    this.toggleSelectionFromGUI(change.id, change.selected);
                    break;
                    
                case 'bulk_select':
                    this.bulkSelectFromGUI(change.ids, change.selected);
                    break;
                    
                case 'delete':
                    this.deleteFromGUI(change.id);
                    break;
                    
                case 'calendar_date_change':
                    this.updateDateFromCalendar(change.id, change.newDate);
                    break;
                    
                case 'calendar_create':
                    this.createFromCalendar(change.record);
                    break;
                    
                case 'calendar_selection':
                    this.toggleSelectionFromCalendar(change.id, change.selected);
                    break;
            }
        });
        
        this.currentState.last_updated = new Date().toISOString();
        this.currentState.gui_changes.push({
            changes: changes.length,
            timestamp: new Date().toISOString()
        });
        
        this.saveState();
        return this.currentState.content_records;
    }
    
    // Update individual field from GUI
    updateFieldFromGUI(recordId, field, value) {
        const record = this.currentState.content_records.find(r => r.id === recordId);
        if (record) {
            record[field] = value;
            record.modified_at = new Date().toISOString();
            record.source = 'gui';
        }
    }
    
    // Reorder records from GUI drag/drop
    reorderFromGUI(fromIndex, toIndex) {
        const records = this.currentState.content_records;
        const [moved] = records.splice(fromIndex, 1);
        records.splice(toIndex, 0, moved);
        
        // Update order field for all records
        records.forEach((record, index) => {
            record.order = index;
            record.modified_at = new Date().toISOString();
        });
    }
    
    // Toggle selection from GUI
    toggleSelectionFromGUI(recordId, selected) {
        const record = this.currentState.content_records.find(r => r.id === recordId);
        if (record) {
            record.selected = selected;
            record.modified_at = new Date().toISOString();
        }
    }
    
    // Bulk selection from GUI
    bulkSelectFromGUI(recordIds, selected) {
        recordIds.forEach(id => {
            const record = this.currentState.content_records.find(r => r.id === id);
            if (record) {
                record.selected = selected;
                record.modified_at = new Date().toISOString();
            }
        });
    }
    
    // Delete from GUI
    deleteFromGUI(recordId) {
        const index = this.currentState.content_records.findIndex(r => r.id === recordId);
        if (index !== -1) {
            this.currentState.content_records.splice(index, 1);
            
            // Reorder remaining records
            this.currentState.content_records.forEach((record, idx) => {
                record.order = idx;
            });
        }
    }
    
    // Calendar-specific methods
    updateDateFromCalendar(recordId, newDate) {
        const record = this.currentState.content_records.find(r => r.id === recordId);
        if (record) {
            record.targetPublishDate = newDate;
            record.target_publish_date = newDate; // Support both naming conventions
            record.modified_at = new Date().toISOString();
            record.source = 'calendar';
            
            console.log(`📅 Calendar: Updated publish date for "${record.description}" to ${newDate}`);
        }
    }
    
    createFromCalendar(recordData) {
        const record = {
            id: recordData.id || `temp_${Date.now()}`,
            selected: true,
            order: this.currentState.content_records.length,
            source: 'calendar',
            ...recordData,
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString()
        };
        
        this.currentState.content_records.push(record);
        console.log(`📅 Calendar: Created new content "${record.description}" for ${record.targetPublishDate}`);
        return record;
    }
    
    toggleSelectionFromCalendar(recordId, selected) {
        const record = this.currentState.content_records.find(r => r.id === recordId);
        if (record) {
            record.selected = selected;
            record.modified_at = new Date().toISOString();
            record.source = 'calendar';
            
            console.log(`📅 Calendar: ${selected ? 'Selected' : 'Deselected'} "${record.description}"`);
        }
    }
    
    // Get calendar statistics
    getCalendarStats() {
        const total = this.currentState.content_records.length;
        const withDates = this.currentState.content_records.filter(r => r.targetPublishDate || r.target_publish_date).length;
        const highPriority = this.currentState.content_records.filter(r => r.priority === 'HIGH' && (r.targetPublishDate || r.target_publish_date)).length;
        
        // Calculate this month
        const now = new Date();
        const thisMonth = this.currentState.content_records.filter(r => {
            const publishDate = r.targetPublishDate || r.target_publish_date;
            if (!publishDate) return false;
            const date = new Date(publishDate);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;
        
        // Calculate upcoming (next 7 days)
        const upcoming = this.currentState.content_records.filter(r => {
            const publishDate = r.targetPublishDate || r.target_publish_date;
            if (!publishDate) return false;
            const date = new Date(publishDate);
            const diffTime = date.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        }).length;
        
        return {
            total_content: withDates,
            this_month: thisMonth,
            high_priority: highPriority,
            upcoming: upcoming
        };
    }
    
    // Get selected records for Airtable submission
    getSelectedRecords() {
        return this.currentState.content_records.filter(r => r.selected);
    }
    
    // Get all records
    getAllRecords() {
        // Automatically load content from disk when missing
        this.loadMissingContentFromDisk();
        return this.currentState.content_records;
    }
    
    // Load missing textContent from local files
    loadMissingContentFromDisk() {
        let changed = false;
        
        this.currentState.content_records.forEach(record => {
            // Load content if file exists but textContent is missing
            if (record.localFilePath && !record.textContent && fs.existsSync(record.localFilePath)) {
                try {
                    const content = fs.readFileSync(record.localFilePath, 'utf8');
                    record.textContent = content;
                    record.wordCount = this.countWords(content);
                    record.contentPreview = this.generatePreview(content, record.description);
                    record.modified_at = new Date().toISOString();
                    changed = true;
                    console.log(`📄 Loaded content from disk: ${record.description}`);
                } catch (error) {
                    console.error(`❌ Error loading content from ${record.localFilePath}:`, error.message);
                }
            }
        });
        
        if (changed) {
            this.saveState();
        }
    }
    
    // Count words in content
    countWords(text) {
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }
    
    // Generate content preview
    generatePreview(content, description) {
        if (!content) return null;
        
        // Remove markdown formatting for cleaner preview
        const cleanContent = content
            .replace(/^#{1,6}\s/gm, '') // Headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
            .replace(/\*(.*?)\*/g, '$1') // Italic
            .replace(/^[-*+]\s/gm, '') // Lists
            .replace(/\n+/g, ' ') // Multiple newlines
            .trim();
            
        const preview = `${description}\n\n${cleanContent.substring(0, 200)}${cleanContent.length > 200 ? '...' : ''}`;
        return preview;
    }
    
    // Clear all records with archival - ENHANCED with complete state reset
    clearAllRecords() {
        const hasRestoredContent = this.currentState.content_records.some(record => 
            record.restoredAt || record.restoredFrom
        );
        
        if (this.currentState.content_records.length > 0) {
            // Archive records before clearing (but not if they're restored content)
            if (!hasRestoredContent) {
                this.archiveRecords();
            } else {
                console.log('🗑️ Skipping archive - detected restored content, performing direct clear');
            }
        }
        
        // COMPLETE STATE RESET - Clear everything
        this.currentState = {
            planning_session_id: null,
            content_records: [],
            last_updated: new Date().toISOString(),
            claude_changes: [],
            gui_changes: [],
            airtable_items: []
        };
        
        // Force clear persistent state file completely
        const cleanState = {
            planning_session_id: null,
            content_records: [],
            last_updated: new Date().toISOString(),
            claude_changes: [],
            gui_changes: [],
            airtable_items: []
        };
        
        // Force write clean state to persistent file multiple times to ensure persistence
        try {
            const fs = require('fs');
            
            // Write clean state
            fs.writeFileSync(this.stateFile, JSON.stringify(cleanState, null, 2));
            console.log('🧹 Force-cleared persistent state file');
            
            // AGGRESSIVE CLEANUP: Wait and write again to ensure no async interference
            setTimeout(() => {
                try {
                    fs.writeFileSync(this.stateFile, JSON.stringify(cleanState, null, 2));
                    console.log('🔒 Double-write completed - state locked clean');
                } catch (error) {
                    console.error('Error in double-write cleanup:', error);
                }
            }, 100);
            
        } catch (error) {
            console.error('Error force-clearing state file:', error);
        }
        
        // Update current state to match  
        this.currentState = cleanState;
        
        // ENHANCED: Clear any restoration flags
        if (hasRestoredContent) {
            console.log('🧹 Removed restored content with metadata cleanup');
        }
        
        console.log('✅ Enhanced clear completed - all records and restore traces removed');
    }
    
    // Archive records (metadata only, no generated content)
    archiveRecords() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveDir = path.join(__dirname, '../archive/planning-sessions');
        
        // Ensure archive directory exists
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }
        
        // Create archived records (strip out generated content)
        const archivedRecords = this.currentState.content_records.map(record => ({
            // Core metadata
            id: record.id,
            description: record.description,
            contentType: record.contentType,
            priority: record.priority,
            generationType: record.generationType,
            generationStatus: record.generationStatus || 'pending',
            
            // Timestamps and references
            created_at: record.created_at,
            modified_at: record.modified_at,
            
            // File references (but not content)
            localFilePath: record.localFilePath,
            contentId: record.contentId,
            airtableRecordId: record.airtableRecordId,
            
            // Content stats (but not actual content)
            wordCount: record.wordCount || 0,
            contentPreview: record.contentPreview ? record.contentPreview.substring(0, 100) + '...' : null,
            
            // Archive info
            archivedAt: new Date().toISOString(),
            archivedReason: 'user_clear_action'
            
            // Explicitly exclude: textContent (large generated content)
        }));
        
        const archiveData = {
            sessionId: this.currentState.planning_session_id,
            archivedAt: new Date().toISOString(),
            recordCount: archivedRecords.length,
            records: archivedRecords
        };
        
        const archiveFile = path.join(archiveDir, `planning-session-${timestamp}.json`);
        
        try {
            fs.writeFileSync(archiveFile, JSON.stringify(archiveData, null, 2));
            console.log(`📦 Archived ${archivedRecords.length} records to: ${path.basename(archiveFile)}`);
        } catch (error) {
            console.error('⚠️ Failed to archive records:', error.message);
        }
    }
    
    // Restore records from archive - FIXED to properly replace state
    restoreFromArchive(archiveFileName) {
        const archiveDir = path.join(__dirname, '../archive/planning-sessions');
        const archiveFile = path.join(archiveDir, archiveFileName);
        
        try {
            if (!fs.existsSync(archiveFile)) {
                console.error(`❌ Archive file not found: ${archiveFileName}`);
                return false;
            }
            
            const archiveData = JSON.parse(fs.readFileSync(archiveFile, 'utf8'));
            
            // Restore records (without textContent, as those are in separate MD files)
            const restoredRecords = archiveData.records.map(record => ({
                ...record,
                // Ensure source field is set properly for dashboard filtering
                source: record.source || 'claude',
                // Reset archive-specific fields
                archivedAt: undefined,
                archivedReason: undefined,
                // Mark as restored
                restoredAt: new Date().toISOString(),
                restoredFrom: archiveFileName
            }));
            
            // COMPLETE STATE REPLACEMENT - Clear and replace with restored records
            this.currentState = {
                planning_session_id: archiveData.sessionId || `restored_${Date.now()}`,
                content_records: restoredRecords,
                last_updated: new Date().toISOString(),
                claude_changes: [],
                gui_changes: [],
                airtable_items: []
            };
            
            // Force save the restored state
            this.saveState();
            
            console.log(`🔄 Restored ${restoredRecords.length} records from: ${archiveFileName}`);
            console.log('💡 Note: Generated content files (if any) remain in /content/local-generation/');
            return true;
            
        } catch (error) {
            console.error('⚠️ Failed to restore from archive:', error.message);
            return false;
        }
    }
    
    // List available archives
    listArchives() {
        const archiveDir = path.join(__dirname, '../archive/planning-sessions');
        
        try {
            if (!fs.existsSync(archiveDir)) {
                console.log('📁 No archives directory found');
                return [];
            }
            
            const files = fs.readdirSync(archiveDir).filter(file => file.endsWith('.json'));
            
            if (files.length === 0) {
                console.log('📝 No archived sessions found');
                return [];
            }
            
            console.log('📦 Available archived sessions:');
            files.forEach(file => {
                try {
                    const archiveData = JSON.parse(fs.readFileSync(path.join(archiveDir, file), 'utf8'));
                    console.log(`  ${file}: ${archiveData.recordCount} records (${archiveData.archivedAt.substring(0, 16)})`);
                } catch (error) {
                    console.log(`  ${file}: Invalid archive file`);
                }
            });
            
            return files;
            
        } catch (error) {
            console.error('⚠️ Failed to list archives:', error.message);
            return [];
        }
    }
    
    // Save state to file (for GUI sync)
    saveState() {
        try {
            fs.writeFileSync(this.stateFile, JSON.stringify(this.currentState, null, 2));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }
    
    // Load state from file
    loadState() {
        try {
            if (fs.existsSync(this.stateFile)) {
                const data = fs.readFileSync(this.stateFile, 'utf8');
                this.currentState = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }
    
    // Watch for GUI changes to state file
    startFileWatcher() {
        if (fs.existsSync(path.dirname(this.stateFile))) {
            fs.watchFile(this.stateFile, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    this.loadState();
                    console.log('🔄 State updated from GUI');
                }
            });
        }
    }
    
    // Create local MD file for content (enhanced for Content ID integration)
    createLocalMDFile(recordId) {
        const record = this.currentState.content_records.find(r => r.id === recordId);
        if (!record) return null;
        
        const date = record.targetPublishDate || new Date().toISOString().split('T')[0];
        const title = (record.description || record.title || 'untitled')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Use Content ID in filename if available
        const contentIdPrefix = record.contentId && !record.contentId.startsWith('temp_') ? 
                               `${record.contentId}_` : '';
        
        // TIER 1 FIX: Filename length validation to prevent ENAMETOOLONG errors
        let fileName = `${contentIdPrefix}${date}-${title}.md`;
        
        // Ensure filename doesn't exceed filesystem limits (255 chars)
        if (fileName.length > 250) { // Leave margin for safety
            const maxTitleLength = 250 - contentIdPrefix.length - date.length - 4; // 4 for "-" and ".md"
            const truncatedTitle = title.substring(0, maxTitleLength);
            fileName = `${contentIdPrefix}${date}-${truncatedTitle}.md`;
        }
        
        const filePath = path.join(__dirname, '../content/local-generation', fileName);
        
        // Generate actual content based on type and topic
        const actualContent = this.generateSampleContent(record);
        
        // Enhanced MD file content with Content ID metadata and actual content
        const mdContent = `# ${record.description || record.title || 'Untitled'}

` +
            `**Content ID**: ${record.contentId || 'Not assigned'}\n` +
            `**Date**: ${date}\n` +
            `**Type**: ${record.contentType || 'Content'}\n` +
            `**Priority**: ${record.priority || 'MEDIUM'}\n` +
            `**Status**: ${record.status || 'draft'}\n` +
            `**Generation Type**: ${record.generationType || 'LOCAL'}\n` +
            `**Keywords**: ${record.primaryKeyword || record.keywords || ''}\n` +
            `**Target Location**: ${record.targetLocation || record.target_location || ''}\n` +
            `**${(cfg.labels && cfg.labels.entitySubtypeLabel) || 'Pest Type'}**: ${record.pestType || record.pest_type || ''}\n\n` +
            (function brandSection() {
                const lines = [];
                const b = cfg.brand || {};
                const t = cfg.templates || {};
                const hasBrand = (Array.isArray(b.guidelines) && b.guidelines.length) || b.voiceGuide || b.personas || b.styleGuide || b.assetsDir || (Array.isArray(b.knowledge) && b.knowledge.length);
                const hasTemplates = t.blogOutline || t.blogDraft || t.socialPost || t.locationPage;
                if (!hasBrand && !hasTemplates) return '';
                lines.push('## Brand References');
                if (hasBrand) {
                    if (Array.isArray(b.guidelines) && b.guidelines.length) {
                        lines.push('\n### Guidelines');
                        b.guidelines.forEach(p => lines.push(`- ${p}`));
                    }
                    if (b.voiceGuide) lines.push(`- Voice Guide: ${b.voiceGuide}`);
                    if (b.personas) lines.push(`- Personas: ${b.personas}`);
                    if (b.styleGuide) lines.push(`- Style Guide: ${b.styleGuide}`);
                    if (b.assetsDir) lines.push(`- Brand Assets: ${b.assetsDir}`);
                    if (Array.isArray(b.knowledge) && b.knowledge.length) {
                        lines.push('\n### Additional Materials');
                        b.knowledge.forEach(p => lines.push(`- ${p}`));
                    }
                }
                if (hasTemplates) {
                    lines.push('\n### Templates');
                    if (t.blogOutline) lines.push(`- Blog Outline: ${t.blogOutline}`);
                    if (t.blogDraft) lines.push(`- Blog Draft: ${t.blogDraft}`);
                    if (t.socialPost) lines.push(`- Social Post: ${t.socialPost}`);
                    if (t.locationPage) lines.push(`- Location Page: ${t.locationPage}`);
                }
                lines.push('');
                return lines.join('\n') + '\n';
            })() +
            `## Airtable Integration\n` +
            `- **Airtable Record ID**: ${record.airtableRecordId || 'Not linked'}\n` +
            `- **Google Drive Folder**: ${record.googleDriveFolder || 'Not created'}\n` +
            `- **Google Docs ID**: ${record.googleDocsId || 'Not created'}\n\n` +
            `## Content Planning\n\n` +
            `${record.notes || 'Content generated via Enhanced Two-Stage Workflow'}\n\n` +
            `## Final Content\n\n` +
            `${actualContent}\n\n` +
            `---\n` +
            `*Created via Claude Code Content ID Bridge - ${new Date().toISOString()}*\n`;
        
        try {
            // Ensure directory exists
            const dirPath = path.join(__dirname, '../content/local-generation');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(filePath, mdContent);
            record.localFilePath = filePath;
            record.status = 'draft';
            record.modified_at = new Date().toISOString();
            this.saveState();
            console.log(`✅ Created local MD file: ${fileName}`);
            console.log(`📂 Content ID: ${record.contentId || 'Not assigned'}`);
            return filePath;
        } catch (error) {
            console.error('Error creating MD file:', error);
            return null;
        }
    }
    
    // Poll Airtable for updates
    async pollAirtable() {
        try {
            // Ensure fetch is available
            if (!fetch) {
                throw new Error('Fetch not available - network operations disabled');
            }
            
            const response = await fetch(cfg.airtable.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        operation: 'airtable',
                        subOperation: 2,
                        baseId: cfg.airtable.baseId,
                        tableId: cfg.airtable.tableId
                    }
                })
            });
            
            if (!response.ok) return;
            
            const data = await response.json();
            if (!Array.isArray(data)) return;
            
            // Filter items with publish dates and update state
            const airtableItems = data
                .filter(item => item[F.publishDate])
                .map(item => ({
                    id: item.id,
                    title: item[F.title] || item[F.description] || 'Airtable Item',
                    publishDate: item[F.publishDate],
                    status: item[F.status] || 'Queued',
                    contentType: item[F.contentType] || 'Content',
                    priority: item[F.priority] || 'MEDIUM',
                    generationType: 'SYSTEMATIC',
                    source: 'airtable'
                }));
            
            this.currentState.airtable_items = airtableItems;
            this.saveState();
            console.log(`🔄 Synced ${airtableItems.length} items from Airtable`);
            return airtableItems;
            
        } catch (error) {
            console.error('Error polling Airtable:', error);
            return [];
        }
    }
    
    // Get combined calendar items (local + Airtable)
    getCalendarItems() {
        const localItems = this.currentState.content_records
            .filter(r => r.targetPublishDate || r.target_publish_date)
            .map(r => ({
                ...r,
                displayType: r.generationType === 'LOCAL' ? '📝 Local' : '🚀 Systematic'
            }));
        
        const airtableItems = (this.currentState.airtable_items || [])
            .map(item => ({
                ...item,
                targetPublishDate: item.publishDate,
                description: item.title,
                displayType: '☁️ Airtable'
            }));
        
        return [...localItems, ...airtableItems];
    }
    
    // Export for CSV
    exportToCSV() {
        const headers = [
            F.contentId, F.description, F.targetPublishDate, F.status, F.contentType,
            F.priority, F.targetLocation, F.pestType, F.primaryKeyword,
            F.contentFormat, F.seasonalRelevance, F.searchVolume, F.keywordDifficulty, F.notes
        ];
        
        let csv = headers.join(',') + '\n';
        
        this.currentState.content_records.forEach(record => {
            const row = [
                '', // Content ID (Airtable will assign)
                record.description || '',
                record.targetPublishDate || record.target_publish_date || '', // Target Publish Date
                '', // Status
                record.contentType || record.content_type || '',
                record.priority || '',
                record.targetLocation || record.target_location || '',
                record.pestType || record.pest_type || '',
                record.primaryKeyword || record.primary_keyword || '',
                record.contentFormat || record.content_format || '',
                record.seasonalRelevance || record.seasonal_relevance || '',
                record.searchVolume || record.search_volume || '',
                record.keywordDifficulty || record.keyword_difficulty || '',
                record.notes || ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`);
            
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }
    
    // Generate summary for Claude Code
    generateSummary() {
        const total = this.currentState.content_records.length;
        const selected = this.currentState.content_records.filter(r => r.selected).length;
        const byType = {};
        const byPriority = {};
        
        this.currentState.content_records.forEach(record => {
            const type = record.contentType || record.content_type || 'Unknown';
            const priority = record.priority || 'Unknown';
            
            byType[type] = (byType[type] || 0) + 1;
            byPriority[priority] = (byPriority[priority] || 0) + 1;
        });
        
        return {
            session_id: this.currentState.planning_session_id,
            total_records: total,
            selected_records: selected,
            last_updated: this.currentState.last_updated,
            breakdown: {
                by_type: byType,
                by_priority: byPriority
            },
            recent_changes: {
                claude: this.currentState.claude_changes.slice(-3),
                gui: this.currentState.gui_changes.slice(-3)
            }
        };
    }
    
    // Generate comprehensive analytics data for Chart.js visualizations
    generateAnalyticsData() {
        const allRecords = [...this.currentState.content_records, ...(this.currentState.airtable_items || [])];
        
        // Content Type Distribution (Doughnut Chart)
        const contentTypeData = {};
        allRecords.forEach(record => {
            const type = record.contentType || record.content_type || 'Unknown';
            contentTypeData[type] = (contentTypeData[type] || 0) + 1;
        });
        
        // Generation Type Split (Bar Chart)
        const generationTypeData = {
            LOCAL: this.currentState.content_records.filter(r => r.generationType === 'LOCAL').length,
            SYSTEMATIC: this.currentState.content_records.filter(r => r.generationType === 'SYSTEMATIC').length + 
                       (this.currentState.airtable_items || []).length
        };
        
        // Priority Level Breakdown (Horizontal Bar Chart)
        const priorityData = {};
        allRecords.forEach(record => {
            const priority = record.priority || 'MEDIUM';
            priorityData[priority] = (priorityData[priority] || 0) + 1;
        });
        
        // Location/Market Focus (Polar Area Chart)
        const locationData = {};
        allRecords.forEach(record => {
            const location = record.targetLocation || record.target_location || 'Unknown';
            locationData[location] = (locationData[location] || 0) + 1;
        });
        
        // Pest Type Content Strategy (Bubble Chart)
        const pestTypeData = [];
        const pestTypes = {};
        allRecords.forEach(record => {
            const pestType = record.pestType || record.pest_type || 'General';
            if (!pestTypes[pestType]) {
                pestTypes[pestType] = {
                    name: pestType,
                    count: 0,
                    totalSearchVolume: 0,
                    avgDifficulty: 0,
                    difficulties: []
                };
            }
            pestTypes[pestType].count += 1;
            
            const searchVolume = parseInt(record.searchVolume || record.search_volume || 0);
            pestTypes[pestType].totalSearchVolume += searchVolume;
            
            const difficulty = record.keywordDifficulty || record.keyword_difficulty || 'Medium';
            const difficultyValue = difficulty === 'Low' ? 1 : difficulty === 'Medium' ? 2 : 3;
            pestTypes[pestType].difficulties.push(difficultyValue);
        });
        
        // Convert pest types to bubble chart format
        Object.keys(pestTypes).forEach(pestType => {
            const data = pestTypes[pestType];
            const avgSearchVolume = data.count > 0 ? data.totalSearchVolume / data.count : 0;
            const avgDifficulty = data.difficulties.length > 0 ? 
                data.difficulties.reduce((a, b) => a + b, 0) / data.difficulties.length : 2;
            
            pestTypeData.push({
                x: avgSearchVolume,
                y: 4 - avgDifficulty, // Invert difficulty (higher = easier)
                r: data.count * 5 + 5, // Bubble size
                label: pestType,
                count: data.count
            });
        });
        
        // Seasonal Content Calendar (Line Chart)
        const seasonalData = {
            'Spring': 0,
            'Summer': 0,
            'Fall': 0,
            'Winter': 0,
            'Year-Round': 0
        };
        allRecords.forEach(record => {
            const season = record.seasonalRelevance || record.seasonal_relevance || 'Year-Round';
            if (seasonalData.hasOwnProperty(season)) {
                seasonalData[season] += 1;
            } else {
                seasonalData['Year-Round'] += 1;
            }
        });
        
        // Search Volume vs Difficulty Analysis
        const searchVolumeData = [];
        allRecords.forEach(record => {
            const searchVolume = parseInt(record.searchVolume || record.search_volume || 0);
            const difficulty = record.keywordDifficulty || record.keyword_difficulty || 'Medium';
            const difficultyValue = difficulty === 'Low' ? 1 : difficulty === 'Medium' ? 2 : 3;
            
            if (searchVolume > 0) {
                searchVolumeData.push({
                    x: searchVolume,
                    y: difficultyValue,
                    label: record.description || record.title || 'Unknown Content'
                });
            }
        });
        
        return {
            contentTypes: {
                labels: Object.keys(contentTypeData),
                data: Object.values(contentTypeData),
                colors: [
                    '#8b5cf6', // Purple - Blog Posts
                    '#f59e0b', // Amber - Social Media
                    '#06b6d4', // Cyan - Location Pages
                    '#ef4444', // Red - Email
                    '#ec4899', // Pink - Video
                    '#10b981'  // Green - Other
                ]
            },
            generationTypes: {
                labels: Object.keys(generationTypeData),
                data: Object.values(generationTypeData),
                colors: ['#8b5cf6', '#06b6d4'] // Purple (LOCAL), Cyan (SYSTEMATIC)
            },
            priorities: {
                labels: Object.keys(priorityData),
                data: Object.values(priorityData),
                colors: ['#dc2626', '#d97706', '#16a34a'] // Red (HIGH), Orange (MEDIUM), Green (LOW)
            },
            locations: {
                labels: Object.keys(locationData),
                data: Object.values(locationData),
                colors: [
                    '#3b82f6', // Blue - Illinois
                    '#8b5cf6', // Purple - Iowa
                    '#10b981', // Green - Wisconsin
                    '#f59e0b'  // Amber - Other
                ]
            },
            pestTypes: pestTypeData,
            seasonal: {
                labels: Object.keys(seasonalData),
                data: Object.values(seasonalData),
                colors: [
                    '#22c55e', // Green - Spring
                    '#f59e0b', // Amber - Summer
                    '#f97316', // Orange - Fall
                    '#3b82f6', // Blue - Winter
                    '#6b7280'  // Gray - Year-Round
                ]
            },
            searchVolumeAnalysis: searchVolumeData,
            totalContent: allRecords.length,
            localContent: this.currentState.content_records.filter(r => r.generationType === 'LOCAL').length,
            systematicContent: this.currentState.content_records.filter(r => r.generationType === 'SYSTEMATIC').length + 
                              (this.currentState.airtable_items || []).length,
            highPriorityContent: allRecords.filter(r => (r.priority || 'MEDIUM') === 'HIGH').length,
            lastUpdated: this.currentState.last_updated
        };
    }
    
    // NEW CONTENT ID INTEGRATION FUNCTIONS
    
    // Get next available Content ID from Airtable and create placeholder record
    async getNextContentId(contentData) {
        try {
            // Ensure fetch is available
            if (!fetch) {
                throw new Error('Fetch not available - network operations disabled');
            }
            
            // Create Airtable record to get real Content ID
            const response = await fetch(cfg.airtable.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        operation: 'airtable',
                        subOperation: 4,
                        baseId: cfg.airtable.baseId,
                        tableId: cfg.airtable.tableId,
                        recordId: '',
                        fileId: '',
                        fileName: '',
                        parentId: '',
                        newParentId: '',
                        newName: '',
                        email: '',
                        role: '',
                        folderName: '',
                        documentId: '',
                        title: '',
                        text: '',
                        index: 1,
                        searchQuery: '',
                        fields: {
                            [F.description]: contentData.description || contentData.title || 'Claude Code Content',
                            [F.contentType]: contentData.contentType || contentData.content_type || 'Blog Post',
                            [F.priority]: contentData.priority || 'MEDIUM',
                            [F.targetLocation]: contentData.targetLocation || contentData.target_location || 'Multi-State',
                            [F.pestType]: contentData.pestType || contentData.pest_type || 'General',
                            [F.contentFormat]: contentData.contentFormat || contentData.content_format || 'WordPress Blog',
                            [F.seasonalRelevance]: contentData.seasonalRelevance || contentData.seasonal_relevance || 'Year-Round',
                            [F.primaryKeyword]: contentData.primaryKeyword || contentData.primary_keyword || '',
                            [F.searchVolume]: parseInt(contentData.searchVolume || contentData.search_volume || 0),
                            [F.keywordDifficulty]: contentData.keywordDifficulty || contentData.keyword_difficulty || 'Low',
                            [F.notes]: `Created via Claude Code - ${new Date().toISOString()}`,
                            [F.status]: '⏳ Planned'
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Airtable request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract Content ID from Airtable response (API returns array)
            let contentId = null;
            let recordData = null;
            
            if (Array.isArray(data) && data.length > 0) {
                recordData = data[0]; // Get first record from array
            } else if (data && data.id) {
                recordData = data; // Handle single record format
            }
            
            if (recordData && recordData.id) {
                // Extract Content ID from record fields
                contentId = recordData.fields && recordData.fields[F.contentId] ? recordData.fields[F.contentId] : 
                           recordData[F.contentId] ? recordData[F.contentId] : 
                           `C${Date.now().toString().slice(-6)}`; // Fallback Content ID
                
                return {
                    contentId: contentId,
                    recordId: recordData.id,
                    success: true
                };
            } else {
                throw new Error('Invalid Airtable response format');
            }
            
        } catch (error) {
            console.error('Error getting Content ID from Airtable:', error);
            throw error;
        }
    }
    
    // Create Google Drive workspace with Content ID organization
    async createGoogleDriveWorkspace(contentId, contentType) {
        try {
            // Ensure fetch is available
            if (!fetch) {
                throw new Error('Fetch not available - network operations disabled');
            }
            
            // Determine parent folder based on content type
            const contentTypeFolders = cfg.drive.folders || {};
            const parentId = (contentType === 'Blog Post' && contentTypeFolders.blog) ? contentTypeFolders.blog
                            : (contentType === 'Social Media' && contentTypeFolders.social) ? contentTypeFolders.social
                            : (contentType === 'Location Page' && contentTypeFolders.location) ? contentTypeFolders.location
                            : (contentType === 'Email' && contentTypeFolders.email) ? contentTypeFolders.email
                            : contentTypeFolders.library;
            
            // Create folder with Content ID naming scheme
            const folderName = `${contentId}_${contentType.replace(' ', '_')}_${Date.now().toString().slice(-6)}`;
            
            const folderResponse = await fetch(cfg.airtable.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        operation: 'googledrive',
                        subOperation: 8,
                        baseId: cfg.airtable.baseId,
                        tableId: cfg.airtable.tableId,
                        recordId: '',
                        fileId: '',
                        fileName: '',
                        parentId: parentId,
                        newParentId: '',
                        newName: '',
                        email: '',
                        role: '',
                        folderName: folderName,
                        documentId: '',
                        title: '',
                        text: '',
                        index: 1,
                        searchQuery: '',
                        fields: {}
                    }
                })
            });
            
            if (!folderResponse.ok) {
                throw new Error(`Google Drive folder creation failed: ${folderResponse.status}`);
            }
            
            const folderData = await folderResponse.json();
            const folderId = folderData.id || folderData.folderId;
            
            // Create working document in the folder
            const docTitle = `${contentId}_${contentType}_Working_Document`;
            
            const docResponse = await fetch(cfg.airtable.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        operation: 'googledocs',
                        subOperation: 2,
                        baseId: cfg.airtable.baseId,
                        tableId: cfg.airtable.tableId,
                        recordId: '',
                        fileId: '',
                        fileName: '',
                        parentId: folderId,
                        newParentId: '',
                        newName: '',
                        email: '',
                        role: '',
                        folderName: '',
                        documentId: '',
                        title: docTitle,
                        text: `# ${contentType} - Content ID: ${contentId}\n\nCreated: ${new Date().toISOString()}\nStatus: Draft\n\n## Content Planning\n\n[Content planning notes will be added here]\n\n## Final Content\n\n[Final content will be written here]`,
                        index: 1,
                        searchQuery: '',
                        fields: {}
                    }
                })
            });
            
            if (!docResponse.ok) {
                throw new Error(`Google Docs creation failed: ${docResponse.status}`);
            }
            
            const docData = await docResponse.json();
            const documentId = docData.documentId || docData.id;
            
            return {
                folderId: folderId,
                folderName: folderName,
                documentId: documentId,
                documentTitle: docTitle,
                success: true
            };
            
        } catch (error) {
            console.error('Error creating Google Drive workspace:', error);
            throw error;
        }
    }
    
    // Update Airtable status and add file references
    async updateAirtableStatus(contentId, status, options = {}) {
        try {
            // Find record by Content ID
            const record = this.currentState.content_records.find(r => r.contentId === contentId || r.id === contentId);
            
            if (!record || !record.airtableRecordId) {
                throw new Error(`No Airtable record found for Content ID: ${contentId}`);
            }
            
            // Ensure fetch is available
            if (!fetch) {
                throw new Error('Fetch not available - network operations disabled');
            }
            
            // Build update fields
            const updateFields = {
                [F.status]: status
            };
            
            // Add file references if provided
            if (options.googleDocsId) {
                updateFields[F.notes] = (updateFields[F.notes] || '') + 
                                      `\nGoogle Doc: https://docs.google.com/document/d/${options.googleDocsId}`;
            }
            
            if (options.localFilePath) {
                updateFields[F.notes] = (updateFields[F.notes] || '') + 
                                      `\nLocal File: ${options.localFilePath}`;
            }
            
            if (options.notes) {
                updateFields[F.notes] = (updateFields[F.notes] || '') + `\n${options.notes}`;
            }
            
            // Update Airtable record
            const response = await fetch(cfg.airtable.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        operation: 'airtable',
                        subOperation: 5,
                        baseId: cfg.airtable.baseId,
                        tableId: cfg.airtable.tableId,
                        recordId: record.airtableRecordId,
                        fileId: '',
                        fileName: '',
                        parentId: '',
                        newParentId: '',
                        newName: '',
                        email: '',
                        role: '',
                        folderName: '',
                        documentId: '',
                        title: '',
                        text: '',
                        index: 1,
                        searchQuery: '',
                        fields: updateFields
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Airtable update failed: ${response.status}`);
            }
            
            // Update local record status
            record.status = status;
            record.modified_at = new Date().toISOString();
            
            if (options.googleDocsId) record.googleDocsId = options.googleDocsId;
            if (options.localFilePath) record.localFilePath = options.localFilePath;
            
            this.saveState();
            
            console.log(`✅ Updated Content ID ${contentId} status to: ${status}`);
            return { success: true, contentId: contentId, status: status };
            
        } catch (error) {
            console.error('Error updating Airtable status:', error);
            throw error;
        }
    }
    
    // Unified content creation method (combines local + systematic)
    async createUnifiedContent(contentData) {
        try {
            const generationType = contentData.generationType || 'LOCAL';
            const useContentId = contentData.useContentId || (generationType === 'SYSTEMATIC');
            
            // Add to sync bridge with Content ID integration
            const records = await this.addContentFromClaude([{
                ...contentData,
                useContentId: useContentId
            }], generationType);
            
            const newRecord = records[records.length - 1]; // Get the newly added record
            
            // Create local MD file
            if (generationType === 'LOCAL' || contentData.createLocalFile === true) {
                const localPath = this.createLocalMDFile(newRecord.id);
                if (localPath) {
                    // Immediately load the generated LOCAL content into the record
                    try {
                        const rawTextContent = await this.readLocalMDContent(localPath);
                        if (rawTextContent && rawTextContent.length > 0) {
                            // Extract clean content without metadata headers for GUI display
                            const cleanTextContent = this.extractCleanContentForAirtable(rawTextContent);
                            
                            // CRITICAL FIX: Update the actual record in the state array with CLEAN content
                            const recordIndex = this.currentState.content_records.findIndex(r => r.id === newRecord.id);
                            if (recordIndex !== -1) {
                                this.currentState.content_records[recordIndex].textContent = cleanTextContent;
                                this.currentState.content_records[recordIndex].contentPreview = this.createContentPreview(cleanTextContent);
                                this.currentState.content_records[recordIndex].wordCount = this.calculateWordCount(cleanTextContent);
                                this.currentState.content_records[recordIndex].generationStatus = 'generated';
                                this.currentState.content_records[recordIndex].modified_at = new Date().toISOString();
                                
                                // Update newRecord reference to match
                                newRecord.textContent = cleanTextContent;
                                newRecord.contentPreview = this.currentState.content_records[recordIndex].contentPreview;
                                newRecord.wordCount = this.currentState.content_records[recordIndex].wordCount;
                                newRecord.generationStatus = 'generated';
                                
                                console.log(`📝 Loaded LOCAL content: ${newRecord.description} (${newRecord.wordCount} words) - CLEAN CONTENT WITHOUT METADATA`);
                                
                                // CRITICAL: Save the state immediately after updating content
                                this.saveState();
                            }
                        }
                    } catch (error) {
                        console.log(`⚠️ Failed to load LOCAL content for ${newRecord.id}:`, error.message);
                        // Update both the record in state and the reference
                        const recordIndex = this.currentState.content_records.findIndex(r => r.id === newRecord.id);
                        if (recordIndex !== -1) {
                            this.currentState.content_records[recordIndex].generationStatus = 'failed';
                            this.saveState();
                        }
                        newRecord.generationStatus = 'failed';
                    }
                    
                    // Update Airtable with local file reference
                    if (newRecord.airtableRecordId) {
                        await this.updateAirtableStatus(newRecord.contentId, '🔄 In Progress', {
                            localFilePath: localPath,
                            notes: 'Local MD file created via Claude Code'
                        });
                    }
                }
            }
            
            console.log(`🎉 Unified content creation completed for: ${contentData.description}`);
            console.log(`📂 Content ID: ${newRecord.contentId}`);
            console.log(`📁 Local file: ${newRecord.localFilePath || 'Not created'}`);
            console.log(`☁️ Google Drive: ${newRecord.googleDriveFolder || 'Not created'}`);
            
            return newRecord;
            
        } catch (error) {
            console.error('Error in unified content creation:', error);
            throw error;
        }
    }

    // STREAMLINED WORKFLOW METHODS
    
    // Submit content to Airtable with text content and auto-initialization
    async submitToAirtableWithText(selectedRecords) {
        try {
            const results = [];
            
            for (const record of selectedRecords) {
                console.log(`📝 Processing streamlined submission: ${record.description}`);
                
                // Read text content from local MD file
                let textContent = '';
                if (record.localFilePath) {
                    try {
                        textContent = await this.readLocalMDContent(record.localFilePath);
                        console.log(`📄 Read ${textContent.length} characters from ${record.localFilePath}`);
                    } catch (error) {
                        console.warn(`⚠️ Could not read content for ${record.id}:`, error.message);
                    }
                }

                // Submit to Airtable with Text field and auto-initialize trigger
                const result = await this.createAirtableRecordWithText(record, textContent);
                results.push(result);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            return results;
        } catch (error) {
            console.error('Error in streamlined submission:', error);
            throw error;
        }
    }

    // Read content from local MD file
    async readLocalMDContent(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                return content;
            } else {
                throw new Error(`File not found: ${filePath}`);
            }
        } catch (error) {
            throw new Error(`Failed to read MD file: ${error.message}`);
        }
    }

    // Create content preview (first 200 characters)
    createContentPreview(textContent) {
        if (!textContent) return '';
        
        // Remove markdown metadata section and just get the main content
        const lines = textContent.split('\n');
        const contentStart = lines.findIndex(line => line.includes('## Final Content') || line.includes('# '));
        const relevantContent = contentStart > -1 ? lines.slice(contentStart).join('\n') : textContent;
        
        // Clean up markdown and get first 200 chars
        const cleanContent = relevantContent
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // Remove bold/italic
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
            .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
            .trim();
        
        return cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;
    }

    // Calculate word count
    calculateWordCount(textContent) {
        if (!textContent) return 0;
        
        // Remove markdown syntax and count words
        const cleanContent = textContent
            .replace(/#{1,6}\s/g, '')
            .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/^\s*[-*+]\s/gm, '')
            .replace(/\n+/g, ' ')
            .trim();
        
        return cleanContent.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Extract clean content for Airtable (removes metadata headers)
    extractCleanContentForAirtable(textContent) {
        if (!textContent) return '';
        
        const lines = textContent.split('\n');
        
        // Find the "## Final Content" section
        const finalContentIndex = lines.findIndex(line => line.trim() === '## Final Content');
        
        if (finalContentIndex === -1) {
            // If no "## Final Content" found, try to find first content paragraph
            const contentStart = lines.findIndex(line => 
                line.trim().length > 0 && 
                !line.startsWith('**') && 
                !line.startsWith('#') && 
                !line.startsWith('-') &&
                !line.includes(F.contentId || 'Content ID') &&
                !line.includes('Date:') &&
                !line.includes('Type:') &&
                !line.includes('Priority:')
            );
            return contentStart > -1 ? lines.slice(contentStart).join('\n').trim() : textContent;
        }
        
        // Start from the line after "## Final Content" and skip empty lines
        let contentStart = finalContentIndex + 1;
        while (contentStart < lines.length && lines[contentStart].trim() === '') {
            contentStart++;
        }
        
        // Remove footer metadata (lines starting with "---")
        const contentLines = lines.slice(contentStart);
        const footerIndex = contentLines.findIndex(line => line.startsWith('---'));
        const cleanLines = footerIndex > -1 ? contentLines.slice(0, footerIndex) : contentLines;
        
        return cleanLines.join('\n').trim();
    }

    // Create Airtable record with text content using direct API
    async createAirtableRecordWithText(record, textContent = '') {
        try {
            // Ensure fetch is available
            if (!fetch) {
                throw new Error('Fetch not available - network operations disabled');
            }

            console.log(`📤 Creating Airtable record via DIRECT API: "${record.description}" (${textContent.length} characters)`);

            // Direct Airtable API configuration
            const AIRTABLE_CONFIG = {
                apiKey: process.env.AIRTABLE_API_KEY || (cfg.airtable && cfg.airtable.apiKey) || 'REPLACE_WITH_API_KEY',
                baseId: (cfg.airtable && cfg.airtable.baseId) || 'REPLACE_BASE_ID',
                tableId: (cfg.airtable && cfg.airtable.tableId) || 'REPLACE_TABLE_ID',
                apiUrl: (cfg.airtable && cfg.airtable.apiUrl) || 'https://api.airtable.com/v0'
            };

            // Prepare fields for direct API submission
            const fields = {
                [F.description]: record.description,
                [F.contentType]: record.contentType || record.content_type || 'Blog Post',
                [F.priority]: record.priority || 'MEDIUM',
                [F.targetLocation]: record.targetLocation || record.target_location || 'Multi-State',
                [F.pestType]: record.pestType || record.pest_type || 'General',
                [F.contentFormat]: record.contentFormat || record.content_format || 'WordPress Blog',
                [F.seasonalRelevance]: record.seasonalRelevance || record.seasonal_relevance || 'Year-Round',
                [F.primaryKeyword]: record.primaryKeyword || record.primary_keyword || '',
                [F.searchVolume]: parseInt(record.searchVolume || record.search_volume || 0),
                [F.keywordDifficulty]: record.keywordDifficulty || record.keyword_difficulty || 'Low',
                [F.text]: this.extractCleanContentForAirtable(textContent), // CLEAN CONTENT - NO METADATA
                [F.notes]: `AUTO_INITIALIZE_TRIGGER - ${new Date().toISOString()}\n\nSOURCE: ${record.filePath || 'Claude Code Local Generation'}\nLENGTH: ${textContent.length} characters`
            };

            console.log(`📊 Direct API Payload - Text field: ${textContent.length} chars, Description: "${record.description}"`);

            const response = await fetch(`${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`🚨 Airtable API Error ${response.status}:`, errorText);
                throw new Error(`Airtable submission failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log(`🔍 Direct API Response:`, JSON.stringify(data, null, 2));
            
            // Direct API returns a single record object
            if (data && data.id && data.fields) {
                const contentId = data.fields[F.contentId] || 'Generated';
                const textFieldPopulated = data.fields[F.text] ? 'YES' : 'NO';
                
                console.log(`✅ DIRECT API Success: ${contentId} - Text field populated: ${textFieldPopulated} (${textContent.length} chars sent)`);
                
                return {
                    success: true,
                    contentId: contentId,
                    recordId: data.id,
                    description: record.description,
                    textLength: textContent.length,
                    textFieldPopulated: !!data.fields[F.text],
                    autoInitialized: true
                };
            } else {
                throw new Error('Invalid Airtable direct API response format');
            }

        } catch (error) {
            console.error(`❌ Streamlined submission failed for "${record.description}":`, error);
            return {
                success: false,
                description: record.description,
                error: error.message
            };
        }
    }

    // Get selected records for streamlined submission
    getSelectedRecordsForStreamlined() {
        return this.currentState.content_records.filter(record => record.selected === true);
    }

    // NEW: Two-Stage Workflow Methods
    
    // Get generation plan summary for Stage 1 (pre-dashboard review)
    getGenerationPlan() {
        const records = this.currentState.content_records;
        const systematic = records.filter(r => r.generationType === 'SYSTEMATIC');
        const localPending = records.filter(r => r.generationType === 'LOCAL' && r.generationStatus === 'pending');
        const localReady = records.filter(r => r.generationType === 'LOCAL' && r.generationStatus !== 'pending');
        
        return {
            systematic: systematic.map(r => ({
                id: r.id,
                description: r.description,
                contentType: r.contentType,
                priority: r.priority,
                status: 'Ready for dashboard'
            })),
            localPending: localPending.map(r => ({
                id: r.id,
                description: r.description,
                contentType: r.contentType,
                priority: r.priority,
                estimatedWords: this.estimateWordCount(r.contentType),
                status: 'Awaiting generation approval'
            })),
            localReady: localReady.map(r => ({
                id: r.id,
                description: r.description,
                contentType: r.contentType,
                priority: r.priority,
                wordCount: r.wordCount,
                status: 'Generated'
            })),
            summary: {
                totalRecords: records.length,
                readyForDashboard: systematic.length + localReady.length,
                pendingApproval: localPending.length,
                estimatedGenerationTime: this.estimateGenerationTime(localPending.length)
            }
        };
    }
    
    // Generate LOCAL content for approved records
    async generateApprovedLocalContent(recordIds) {
        const results = [];
        const recordsToGenerate = this.currentState.content_records.filter(r => 
            recordIds.includes(r.id) && r.generationType === 'LOCAL' && r.generationStatus === 'pending'
        );
        
        console.log(`🚀 Generating LOCAL content for ${recordsToGenerate.length} approved records...`);
        
        for (const record of recordsToGenerate) {
            try {
                console.log(`📝 Generating: ${record.description}`);
                
                const filePath = this.createLocalMDFile(record.id);
                if (filePath) {
                    const textContent = await this.readLocalMDContent(filePath);
                    record.textContent = textContent;
                    record.contentPreview = this.createContentPreview(textContent);
                    record.wordCount = this.calculateWordCount(textContent);
                    record.generationStatus = 'generated';
                    record.modified_at = new Date().toISOString();
                    
                    results.push({
                        success: true,
                        id: record.id,
                        description: record.description,
                        wordCount: record.wordCount,
                        filePath: filePath
                    });
                    
                    console.log(`✅ Generated: ${record.description} (${record.wordCount} words)`);
                } else {
                    throw new Error('MD file creation failed');
                }
                
            } catch (error) {
                record.generationStatus = 'failed';
                results.push({
                    success: false,
                    id: record.id,
                    description: record.description,
                    error: error.message
                });
                console.log(`❌ Failed: ${record.description} - ${error.message}`);
            }
        }
        
        this.saveState();
        return results;
    }
    
    // Estimate word count based on content type
    estimateWordCount(contentType) {
        const estimates = {
            'Blog Post': '800-1200',
            'Social Media': '50-150',
            'Email': '200-400',
            'Location Page': '600-1000',
            'Video': '100-300'
        };
        return estimates[contentType] || '300-600';
    }
    
    // Estimate generation time based on number of pieces
    estimateGenerationTime(count) {
        if (count === 0) return '0 minutes';
        if (count <= 2) return '2-3 minutes';
        if (count <= 5) return '5-7 minutes';
        return `${Math.ceil(count * 1.5)}-${Math.ceil(count * 2)} minutes`;
    }
    
    // Get dashboard-ready records (all SYSTEMATIC + generated LOCAL)
    getDashboardReadyRecords() {
        return this.currentState.content_records.filter(r => 
            r.generationType === 'SYSTEMATIC' || r.generationStatus === 'generated'
        );
    }

    // Enhance content data with intelligent pest type and location detection
    enhanceContentData(content) {
        const description = content.description || '';
        const enhancedContent = { ...content };
        
        // Intelligent location detection - default to primary service area
        if (!enhancedContent.targetLocation && !enhancedContent.target_location) {
            enhancedContent.targetLocation = 'Illinois';
        }
        
        // Intelligent pest type detection from description
        if (!enhancedContent.pestType) {
            const desc = description.toLowerCase();
            if (desc.includes('bed bug') || desc.includes('bedbug')) {
                enhancedContent.pestType = 'Bed Bugs';
            } else if (desc.includes('ant')) {
                enhancedContent.pestType = 'Ants';
            } else if (desc.includes('spider')) {
                enhancedContent.pestType = 'Spiders';
            } else if (desc.includes('wasp') || desc.includes('hornet')) {
                enhancedContent.pestType = 'Wasps';
            } else if (desc.includes('rodent') || desc.includes('mouse') || desc.includes('rat')) {
                enhancedContent.pestType = 'Rodents';
            } else {
                enhancedContent.pestType = 'General';
            }
        }
        
        return enhancedContent;
    }

    // TIER 3: Enhanced content generation with intelligent pest type detection and seasonal adaptation
    generateSampleContent(record) {
        let contentType = record.contentType || 'Blog Post';
        
        // TIER 1 FIX: Enhanced content type detection and normalization
        contentType = this.normalizeContentType(contentType);
        const location = record.targetLocation || record.target_location || 'Illinois';
        const description = record.description || 'Professional Services Content';
        
        // TIER 3: Advanced pest type detection with semantic analysis
        let pestType = record.pestType;
        if (!pestType || pestType === 'General') {
            pestType = this.detectPestTypeFromDescription(description);
        }
        
        // TIER 3: Seasonal content adaptation
        const seasonalContext = this.getSeasonalContext();
        const contentEnhancement = this.getContentEnhancement(description, pestType, seasonalContext);

        // TIER 3: Enhanced content templates with seasonal adaptation and content enhancement
        const templates = {
            'Social Media': this.generateSocialMediaContent(pestType, location, description, contentEnhancement),
            'Social Media Post': this.generateSocialMediaContent(pestType, location, description, contentEnhancement), // FIX: Added explicit mapping
            'Email': this.generateEmailContent(pestType, location, description, contentEnhancement),
            'Blog Post': this.generateBlogContent(pestType, location, description, contentEnhancement),
            'Guide': this.generateBlogContent(pestType, location, description, contentEnhancement), // Maps Guide to Blog content
            'Location Page': this.generateLocationPageContent(pestType, location, description, contentEnhancement)
        };

        return templates[contentType] || templates['Blog Post'];
    }

    // TIER 1 FIX: Content type normalization method
    normalizeContentType(contentType) {
        if (!contentType) return 'Blog Post';
        
        // Normalize variations to standard types
        const normalized = contentType.toLowerCase().trim();
        
        if (normalized.includes('social media') || normalized.includes('social')) {
            return 'Social Media Post';
        }
        if (normalized.includes('blog')) {
            return 'Blog Post';
        }
        if (normalized.includes('location') || normalized.includes('page')) {
            return 'Location Page';
        }
        if (normalized.includes('email')) {
            return 'Email';
        }
        if (normalized.includes('guide')) {
            return 'Guide';
        }
        
        // Return original if no match found
        return contentType;
    }
    
    // TIER 3: Advanced pest type detection with semantic analysis
    detectPestTypeFromDescription(description) {
        const desc = description.toLowerCase();
        
        // Enhanced semantic detection with context awareness
        const pestPatterns = {
            'Spiders': [
                'spider', 'arachnid', 'web', 'black widow', 'brown recluse', 'wolf spider',
                'house spider', 'jumping spider', 'orb weaver', 'cellar spider'
            ],
            'Wasps': [
                'wasp', 'hornet', 'yellow jacket', 'paper wasp', 'mud dauber', 'nest',
                'stinger', 'aggressive', 'late summer', 'fall aggression'
            ],
            'Bed Bugs': [
                'bed bug', 'bedbug', 'blood', 'mattress', 'bite', 'infestation',
                'hitchhiker', 'travel', 'hotel', 'secondhand'
            ],
            'Ants': [
                'ant', 'colony', 'trail', 'carpenter ant', 'pavement ant', 'pharaoh ant',
                'sugar ant', 'kitchen', 'crumb', 'scout'
            ],
            'Rodents': [
                'rodent', 'mouse', 'rat', 'mice', 'gnaw', 'droppings', 'nest',
                'attic', 'basement', 'chew', 'hole'
            ],
            'Overwintering': [
                'overwintering', 'cluster flies', 'boxelder bug', 'asian lady beetle',
                'stink bug', 'winter', 'hibernate', 'shelter'
            ]
        };
        
        // Score-based detection for better accuracy
        let bestMatch = 'General';
        let bestScore = 0;
        
        for (const [pestType, patterns] of Object.entries(pestPatterns)) {
            let score = 0;
            for (const pattern of patterns) {
                if (desc.includes(pattern)) {
                    // Weight certain patterns higher
                    const weight = pattern.length > 8 ? 2 : 1; // Longer, more specific terms get higher weight
                    score += weight;
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = pestType;
            }
        }
        
        return bestMatch;
    }
    
    // TIER 3: Seasonal context awareness
    getSeasonalContext() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        
        const seasonalData = {
            // Winter (Dec, Jan, Feb)
            winter: {
                months: [11, 0, 1],
                focus: 'Indoor pest activity, overwintering pests, structural damage prevention',
                urgency: 'high',
                keyPests: ['Rodents', 'Overwintering', 'Spiders']
            },
            // Spring (Mar, Apr, May)
            spring: {
                months: [2, 3, 4],
                focus: 'Emerging pests, colony establishment, prevention preparation',
                urgency: 'medium',
                keyPests: ['Ants', 'Spiders', 'General']
            },
            // Summer (Jun, Jul, Aug)
            summer: {
                months: [5, 6, 7],
                focus: 'Peak pest activity, breeding cycles, outdoor control',
                urgency: 'high',
                keyPests: ['Wasps', 'Ants', 'Bed Bugs']
            },
            // Fall (Sep, Oct, Nov)
            fall: {
                months: [8, 9, 10],
                focus: 'Overwintering preparation, home invasion, late season aggression',
                urgency: 'critical',
                keyPests: ['Overwintering', 'Wasps', 'Spiders']
            }
        };
        
        for (const [season, data] of Object.entries(seasonalData)) {
            if (data.months.includes(month)) {
                return { season, ...data };
            }
        }
        
        return seasonalData.fall; // Default fallback
    }
    
    // TIER 3: Content enhancement based on context
    getContentEnhancement(description, pestType, seasonalContext) {
        const enhancement = {
            urgencyLevel: seasonalContext.urgency,
            seasonalFocus: seasonalContext.focus,
            isPriorityPest: seasonalContext.keyPests.includes(pestType),
            locationRelevance: this.getLocationRelevance(description),
            familySafety: this.getFamilySafetyContext(description),
            callToAction: this.getSeasonalCallToAction(pestType, seasonalContext)
        };
        
        return enhancement;
    }
    
    // TIER 3: Location relevance detection
    getLocationRelevance(description) {
        const desc = description.toLowerCase();
        const locations = {
            'Illinois': ['illinois', 'chicago', 'rockford', 'peoria', 'springfield'],
            'Iowa': ['iowa', 'des moines', 'cedar rapids', 'davenport'],
            'Wisconsin': ['wisconsin', 'milwaukee', 'madison', 'green bay']
        };
        
        for (const [state, cities] of Object.entries(locations)) {
            for (const city of cities) {
                if (desc.includes(city)) {
                    return { state, hasSpecificLocation: city !== state.toLowerCase() };
                }
            }
        }
        
        return { state: 'Illinois', hasSpecificLocation: false }; // Default
    }
    
    // TIER 3: Family safety context
    getFamilySafetyContext(description) {
        const desc = description.toLowerCase();
        const safetyKeywords = [
            'family', 'child', 'pet', 'safe', 'non-toxic', 'eco-friendly',
            'school', 'children', 'baby', 'toddler', 'pregnant'
        ];
        
        const safetyScore = safetyKeywords.reduce((score, keyword) => {
            return desc.includes(keyword) ? score + 1 : score;
        }, 0);
        
        return {
            isFamilyFocused: safetyScore > 0,
            safetyLevel: safetyScore > 2 ? 'high' : safetyScore > 0 ? 'medium' : 'standard'
        };
    }
    
    // TIER 3: Seasonal call-to-action optimization
    getSeasonalCallToAction(pestType, seasonalContext) {
        const urgencyMap = {
            critical: 'Call {{COMPANY_NAME}} today for immediate inspection',
            high: 'Schedule your {{COMPANY_NAME}} inspection this week',
            medium: 'Contact {{COMPANY_NAME}} for professional assessment',
            low: 'Learn more about {{COMPANY_NAME}} protection plans'
        };
        
        const seasonalCTAs = {
            fall: {
                'Overwintering': 'Act now before they move inside for winter',
                'Wasps': 'Emergency wasp removal - same day service available',
                'Spiders': 'Prevent fall spider invasion with professional treatment'
            },
            winter: {
                'Rodents': 'Stop winter rodent damage before it starts',
                'Overwintering': 'Eliminate indoor pest activity now'
            },
            spring: {
                'Ants': 'Prevent spring ant colonies with barrier treatment',
                'General': 'Get ahead of pest season with preventive care'
            },
            summer: {
                'Wasps': 'Protect your family from aggressive summer wasps',
                'Bed Bugs': 'Don\'t let bed bugs ruin your summer travel'
            }
        };
        
        const specificCTA = seasonalCTAs[seasonalContext.season]?.[pestType];
        const urgencyCTA = urgencyMap[seasonalContext.urgency];
        
        return {
            specific: specificCTA || 'Professional service you can trust',
            urgency: urgencyCTA,
            combined: specificCTA ? `${specificCTA} - ${urgencyCTA}` : urgencyCTA
        };
    }

    // TIER 3: Enhanced social media content generation with seasonal adaptation
    generateSocialMediaContent(pestType, location, description, contentEnhancement = null) {
        const pestMessages = {
            'Ants': `🐜 Winter ant invasions are starting early this year! Don't let these tiny invaders take over your ${location} home. Our eco-friendly treatments create an invisible barrier that keeps ants out while keeping your family safe. Call {{COMPANY_NAME}} today for your FREE inspection! #PestControl #${location.replace(/\s+/g, '')}`,
            'Spiders': `🕷️ Fall spider season is here! Common house spiders and black widows are seeking warm shelter in ${location} homes. Our targeted spider treatments eliminate existing populations and prevent new invasions. Professional results guaranteed! #SpiderControl #${location.replace(/\s+/g, '')}`,
            'Wasps': `⚠️ WASP EMERGENCY PROTOCOL: If you discover a wasp nest near your ${location} property, DON'T attempt DIY removal! Our certified technicians have specialized equipment and protective gear. Same-day emergency service available. Call {{COMPANY_NAME}} immediately! #WaspRemoval #Emergency`,
            'General': `🏠 Protect your ${location} home this season! {{COMPANY_NAME}}'s comprehensive pest protection covers ants, spiders, rodents, and more. Join our {{PROTECTION_PROGRAM_NAME}} for year-round coverage and priority service. {{CORE_MESSAGE}}. #PestControl #${location.replace(/\s+/g, '')}`
        };

        let content = pestMessages[pestType] || pestMessages['General'];
        
        // TIER 3: Apply content enhancement if provided
        if (contentEnhancement) {
            content = this.enhanceSocialContent(content, contentEnhancement, pestType, location);
        }
        
        return content;
    }
    
    // TIER 3: Social media content enhancement
    enhanceSocialContent(content, enhancement, pestType, location) {
        let enhancedContent = content;
        
        // Apply seasonal urgency enhancement
        if (enhancement.urgencyLevel === 'critical' && enhancement.isPriorityPest) {
            enhancedContent = enhancedContent.replace('Call {{COMPANY_NAME}}', '⚠️ URGENT: Call {{COMPANY_NAME}}');
        }
        
        // Add family safety messaging for high safety context
        if (enhancement.familySafety.safetyLevel === 'high') {
            enhancedContent = enhancedContent.replace('#PestControl', '#FamilySafe #PestControl');
        }
        
        // Add seasonal call-to-action if different from default
        if (enhancement.callToAction.specific) {
            const ctaPattern = /(Call {{COMPANY_NAME}} [^!]*!)/;
            const match = enhancedContent.match(ctaPattern);
            if (match) {
                enhancedContent = enhancedContent.replace(match[1], 
                    `${enhancement.callToAction.specific} - ${enhancement.callToAction.urgency}!`);
            }
        }
        
        return enhancedContent;
    }
    
    // TIER 3: Blog content enhancement
    enhanceBlogContent(content, enhancement, pestType, location) {
        let enhancedContent = content;
        
        // Add seasonal urgency to the introduction
        if (enhancement.urgencyLevel === 'critical') {
            const urgencyText = `\n\n⚠️ **URGENT SEASONAL ALERT**: ${enhancement.seasonalFocus} - immediate action is recommended.\n`;
            enhancedContent = urgencyText + enhancedContent;
        }
        
        // Enhance family safety messaging
        if (enhancement.familySafety.safetyLevel === 'high') {
            enhancedContent = enhancedContent.replace(
                'family safe', 
                'family-safe, child-friendly, and pet-safe'
            );
        }
        
        // Add enhanced call-to-action
        if (enhancement.callToAction.combined) {
            enhancedContent = enhancedContent.replace(
                /Call {{COMPANY_NAME}} [^!]*!/,
                `${enhancement.callToAction.combined}!`
            );
        }
        
        return enhancedContent;
    }
    
    // TIER 3: Email content enhancement (simplified for space)
    enhanceEmailContent(content, enhancement, pestType, location) {
        let enhancedContent = content;
        
        // Add urgent subject line enhancement
        if (enhancement.urgencyLevel === 'critical') {
            enhancedContent = enhancedContent.replace('Subject:', 'Subject: ⚠️ URGENT:');
        }
        
        return enhancedContent;
    }

    // Generate email content  
    generateEmailContent(pestType, location, description) {
        const pestEmails = {
            'Wasps': `Subject: URGENT: Wasp Nest Discovered - Immediate Action Required

Dear Homeowner,

If you've discovered a wasp nest on your ${location} property, your safety is our top priority. Please follow this emergency protocol:

IMMEDIATE STEPS:
• Stay at least 20 feet away from the nest
• Keep children and pets indoors
• Do NOT attempt to remove or spray the nest yourself
• Avoid loud noises or sudden movements near the area

WHY PROFESSIONAL REMOVAL IS CRITICAL:
Wasps become increasingly aggressive when threatened, and DIY attempts often result in multiple stings and incomplete removal.

OUR EMERGENCY RESPONSE:
✓ Same-day service available
✓ Specialized protective equipment
✓ Complete nest removal and treatment
✓ Follow-up inspection included

Call {{COMPANY_NAME}} immediately at {{PHONE_NUMBER}} for emergency wasp removal.

Stay safe,
The {{COMPANY_NAME}} Team

P.S. Ask about our Pests Protection Club to prevent future wasp invasions.`,

            'Ants': `Subject: Winter Ant Prevention - Act Now Before They Invade

Dear ${location} Homeowner,

Winter ant invasions are starting earlier than ever, and your home could be their next target.

THE PROBLEM:
As temperatures drop, ant colonies seek warm, food-rich environments - exactly what your home provides.

OUR SOLUTION:
Our advanced ant barrier treatment creates an invisible protective shield around your home that lasts all winter long.

WHAT'S INCLUDED:
✓ Complete perimeter treatment
✓ Entry point sealing
✓ Interior spot treatments as needed
✓ 90-day guarantee

LIMITED TIME: Schedule by [DATE] and save 20% on winter ant prevention.

Book your FREE inspection today!

Best regards,
{{COMPANY_NAME}} Team`,

            'General': `Subject: Your ${location} Home's Pest Protection Plan

Dear Valued Customer,

Seasonal pest activity is increasing in the ${location} area, and now is the perfect time to strengthen your home's defenses.

OUR COMPREHENSIVE APPROACH:
• Thorough property inspection
• Targeted treatment for active pests  
• Preventive barrier application
• Ongoing monitoring and maintenance

PESTS PROTECTION CLUB BENEFITS:
✓ Priority scheduling
✓ Quarterly inspections
✓ Unlimited service calls
✓ 25% savings on additional treatments

Your home deserves professional protection. Schedule your inspection today!

Protecting your family,
The {{COMPANY_NAME}} Team`
        };

        return pestEmails[pestType] || pestEmails['General'];
    }

    // Generate blog post content
    generateBlogContent(pestType, location, description) {
        // {{COMPANY_NAME}} GUIDELINE ENFORCEMENT: Blog posts must be agent-generated to meet {{CONTENT_LENGTH_REQUIREMENTS}} requirement
        // Direct template generation is PROHIBITED for blog content to ensure brand compliance
        
        throw new Error(`
🚫 {{COMPANY_NAME}} COMPLIANCE ERROR: Direct blog generation bypassed

Blog posts must follow {{COMPANY_NAME}} guidelines:
- Length: 1,000-1,500 words (template only has ~228 words)
- Brand Voice: Empathetic, competent, neighborly 
- Structure: 70% educational / 30% promotional
- Location Integration: 5-7 mentions per 1,000 words
- Seasonal Context: Weather/season integration required

REQUIRED SOLUTION:
Use agent orchestration for all blog content:
1. Run "let's plan" workflow
2. Coordinate with content-marketing-strategist
3. Generate via lead-writer agent
4. Stage completed content to dashboard

BLOCKED COMMAND: ${description}
CONTENT TYPE: Blog Post  
REASON: Template bypass violates {{COMPANY_NAME}} content standards
        `);
        
        // Legacy template code preserved but unreachable
        const pestBlogs = {
            'Spiders': `Fall is prime spider season in ${location}, and homeowners are starting to notice more eight-legged visitors in their homes. While most spiders are harmless, some species like the black widow can pose serious health risks to your family.

## Common Fall Spiders in ${location}

**House Spiders**: These small, brown spiders build webs in corners and quiet areas. While not dangerous, they can quickly multiply if left unchecked.

**Wolf Spiders**: Large, fast-moving spiders that hunt at night. They don't build webs but can deliver a painful bite if threatened.

**Black Widow Spiders**: The most dangerous species in our area. Identified by their shiny black body and red hourglass marking, their bite requires immediate medical attention.

## Why Professional Spider Control Works

DIY sprays often miss spider hiding spots and egg sacs, leading to recurring infestations. Our trained technicians know exactly where spiders hide and breed, ensuring complete elimination.

## Our Spider Treatment Process

1. **Comprehensive Inspection**: We identify all spider species and nesting areas
2. **Targeted Treatment**: Species-specific treatments for maximum effectiveness  
3. **Web Removal**: Complete elimination of existing webs and egg sacs
4. **Preventive Barrier**: Long-lasting perimeter treatment to prevent re-infestation

## Protecting Your Family

Don't let spiders take over your ${location} home this fall. Our guaranteed spider control service eliminates existing populations and prevents new invasions.

Call {{COMPANY_NAME}} today for your free spider inspection and take back control of your home!`,

            'Bed Bugs': `Bed bug infestations in ${location} are on the rise, and early identification is crucial for effective treatment. These elusive parasites are expert hitchhikers that can infest even the cleanest homes.

## How to Identify Bed Bugs

**Physical Appearance**: Adult bed bugs are small, oval, brownish insects about the size of an apple seed. When engorged with blood, they become reddish-brown and more elongated.

**Common Hiding Spots**: 
- Mattress seams and bed frames
- Furniture crevices and upholstery
- Behind headboards and nightstands  
- Electrical outlets near beds
- Picture frames and wall hangings

## Early Warning Signs

**Bite Patterns**: Bed bug bites often appear in clusters or lines on exposed skin, typically causing red, itchy welts.

**Physical Evidence**:
- Dark or rust-colored stains on sheets (crushed bed bugs)
- Small blood spots on pillowcases
- Sweet, musty odor in heavily infested rooms
- Tiny dark spots (bed bug fecal matter) on mattresses

## Why Professional Treatment is Essential

DIY treatments often fail because bed bugs hide deep in cracks and crevices that are impossible to reach with consumer products. Our heat treatment and targeted chemical applications eliminate all life stages, including eggs.

## {{COMPANY_NAME}}'s Bed Bug Elimination Process

1. **Thorough Inspection**: We identify all infestation areas using detection tools
2. **Customized Treatment Plan**: Combining heat treatment and residual applications  
3. **Follow-up Service**: Ensuring complete elimination with return visits
4. **Prevention Guidance**: Tips to avoid future infestations

## Immediate Action Steps

If you suspect bed bugs in your ${location} home:
- Don't panic or start moving furniture
- Avoid DIY sprays that can scatter the infestation
- Call {{COMPANY_NAME}} immediately for professional inspection

Early intervention saves time, money, and prevents the infestation from spreading throughout your home.

Contact {{COMPANY_NAME}} today for emergency bed bug inspection and guaranteed elimination service!`,

            'Ants': `Winter ant invasions in ${location} homes are becoming increasingly common, and this year's mild fall weather has created perfect conditions for early ant activity.

## Why Ants Invade Homes in Winter

Unlike many pests that hibernate, certain ant species remain active year-round. As outdoor food sources become scarce, they seek the warmth and abundance your home provides.

## Common Winter Ants in ${location}

**Pavement Ants**: Small black ants that enter through cracks in foundations and create trails to food sources.

**Pharaoh Ants**: Tiny yellow ants that prefer warm, humid areas like kitchens and bathrooms.

**Carpenter Ants**: Large black ants that can cause structural damage by excavating wood for their nests.

## The {{COMPANY_NAME}} Winter Ant Solution

Our advanced ant barrier treatment creates an invisible shield around your home that lasts all winter long. This environmentally-friendly approach eliminates existing colonies while preventing new invasions.

## Treatment Benefits

✓ Long-lasting protection (up to 6 months)
✓ Safe for children and pets
✓ Eliminates existing ant trails and colonies
✓ Prevents structural damage from carpenter ants

## Don't Wait Until It's Too Late

Once ants establish trails in your home, elimination becomes much more difficult and expensive. Preventive treatment is always more effective than reactive measures.

Protect your ${location} home today with {{COMPANY_NAME}}'s proven winter ant prevention program!`,

            'General': `Pest activity in ${location} is changing with the seasons, and your home's pest protection strategy should adapt accordingly. Here's what every homeowner needs to know about year-round pest prevention.

## Seasonal Pest Patterns in ${location}

Each season brings unique pest challenges that require different approaches and treatments.

**Spring**: Ant colonies become active, spiders emerge from winter hiding spots
**Summer**: Peak activity for most pests, increased breeding and population growth
**Fall**: Pests seek shelter in homes, preparing for winter survival
**Winter**: Indoor pest activity continues, structural pests cause the most damage

## The Comprehensive Approach

Effective pest control isn't about treating one problem at a time - it's about creating a year-round protection system that adapts to seasonal pest behavior.

## {{COMPANY_NAME}}'s Seasonal Protection Program

Our Pests Protection Club membership provides:

✓ Quarterly inspections and treatments
✓ Seasonal adjustments to treatment methods
✓ Priority service for urgent pest issues
✓ Comprehensive coverage for all common pests

## Why Choose Professional Protection

DIY pest control often fails because it treats symptoms rather than causes. Our trained technicians understand pest behavior, breeding cycles, and the most effective treatment methods for each species.

## Investment in Your Home's Value

Professional pest protection preserves your property value and protects your family's health and comfort.

Contact {{COMPANY_NAME}} today to learn more about our comprehensive pest protection programs!`
        };

        return pestBlogs[pestType] || pestBlogs['General'];
    }

    // Generate location page content
    generateLocationPageContent(pestType, location, description) {
        return `Professional {{INDUSTRY}} services for ${location} homeowners and businesses. {{COMPANY_NAME}} provides comprehensive {{SERVICE_DESCRIPTION}} with guaranteed results.

## Pest Control Services in ${location}

{{COMPANY_NAME}} has been protecting ${location} properties for over {{YEARS_EXPERIENCE}} years with safe, effective {{INDUSTRY}} solutions. Our local expertise and advanced treatment methods ensure your {{INDUSTRY}} problems are solved quickly and completely.

## Common Pest Issues in ${location}

• Ant invasions during seasonal changes
• Spider infestations in basements and garages  
• Rodent problems in winter months
• Wasp and hornet nest removal
• General insect control year-round

## Our ${location} Service Area

We proudly serve all neighborhoods in ${location} including [LOCAL AREAS]. Same-day and emergency services available.

## Why Choose {{COMPANY_NAME}} for ${location} {{INDUSTRY}}

✓ Local expertise and knowledge
✓ Eco-friendly, family-safe treatments
✓ Guaranteed results with follow-up service
✓ Licensed and insured technicians
✓ Pests Protection Club membership available

## Get Your Free ${location} Pest Inspection

Call today to schedule your complimentary pest inspection and receive a customized treatment plan for your ${location} property.

Contact {{COMPANY_NAME}}: {{PHONE_NUMBER}} | {{EMAIL}} | {{ADDRESS}}`;
    }
}

// Export for use in both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeGUIBridge;
} else {
    window.ClaudeGUIBridge = ClaudeGUIBridge;
}
