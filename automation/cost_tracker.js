// Client API Cost Tracking System
// Monitors and tracks content generation costs across all systems

class ClientCostTracker {
    constructor() {
        this.costLog = [];
        this.monthlyBudget = 40.00; // Default monthly budget
        this.currentSpend = 0.00;
        this.loadCostHistory();
    }

    // Track individual content costs
    trackContentCost(contentData) {
        const cost = this.calculateContentCost(contentData);
        
        const logEntry = {
            id: contentData.id || `cost_${Date.now()}`,
            date: new Date().toISOString(),
            contentType: contentData.contentType,
            description: contentData.description?.substring(0, 50) + '...',
            productionPath: contentData.production_path || 'unknown',
            estimatedCost: cost.estimated,
            actualCost: cost.actual || null,
            expectedLeads: contentData.expected_leads || 0,
            roi: this.calculateROI(cost.estimated, contentData.expected_leads),
            budgetRemaining: this.monthlyBudget - this.currentSpend - cost.estimated
        };

        this.costLog.push(logEntry);
        this.currentSpend += cost.estimated;
        this.saveCostHistory();

        console.log('💰 Cost Tracking:', logEntry);
        return logEntry;
    }

    // Calculate content generation costs
    calculateContentCost(content) {
        let estimatedCost = 0;

        // Base content generation costs
        switch (content.contentType) {
            case 'Blog Post':
                estimatedCost += 0.75; // Blog generation
                if (content.images_required) {
                    estimatedCost += 0.25; // Featured image
                }
                if (content.searchVolume > 1000) {
                    estimatedCost += 0.25; // Enhanced SEO optimization
                }
                break;

            case 'Social Media':
                estimatedCost += 0.25; // Social post
                estimatedCost += 0.20; // Graphics (always required)
                break;

            case 'Location Page':
                estimatedCost += 1.00; // Page generation
                estimatedCost += 0.30; // Local imagery
                break;

            default:
                estimatedCost += 0.50; // Default content cost
        }

        // Complexity modifiers
        if (content.complexity === 'Complex') {
            estimatedCost *= 1.5;
        }
        if (content.priority === 'HIGH') {
            estimatedCost *= 1.2; // Rush processing
        }

        return {
            estimated: Math.round(estimatedCost * 100) / 100,
            breakdown: this.getCostBreakdown(content)
        };
    }

    // Calculate ROI
    calculateROI(cost, expectedLeads) {
        const leadValue = 75; // Average customer value
        const expectedRevenue = expectedLeads * leadValue;
        return expectedRevenue > 0 ? 
            Math.round(((expectedRevenue - cost) / cost) * 100) : 0;
    }

    // Get cost breakdown
    getCostBreakdown(content) {
        const breakdown = [];
        
        if (content.contentType === 'Blog Post') {
            breakdown.push({ item: 'Content Generation', cost: 0.75 });
            if (content.images_required) {
                breakdown.push({ item: 'Featured Image', cost: 0.25 });
            }
        }
        
        return breakdown;
    }

    // Budget monitoring
    checkBudgetStatus() {
        const remaining = this.monthlyBudget - this.currentSpend;
        const percentUsed = (this.currentSpend / this.monthlyBudget) * 100;

        let status = 'green';
        if (percentUsed > 90) status = 'red';
        else if (percentUsed > 75) status = 'yellow';

        return {
            totalBudget: this.monthlyBudget,
            currentSpend: this.currentSpend,
            remaining: remaining,
            percentUsed: Math.round(percentUsed),
            status: status,
            canGenerate: remaining > 0.50 // Minimum cost for content
        };
    }

    // Get monthly report
    getMonthlyReport() {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        
        const monthlyEntries = this.costLog.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === thisMonth && 
                   entryDate.getFullYear() === thisYear;
        });

        const totalCost = monthlyEntries.reduce((sum, entry) => sum + entry.estimatedCost, 0);
        const totalLeads = monthlyEntries.reduce((sum, entry) => sum + entry.expectedLeads, 0);
        const avgROI = monthlyEntries.length > 0 ? 
            monthlyEntries.reduce((sum, entry) => sum + entry.roi, 0) / monthlyEntries.length : 0;

        return {
            period: `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}`,
            contentPieces: monthlyEntries.length,
            totalCost: Math.round(totalCost * 100) / 100,
            expectedLeads: totalLeads,
            averageROI: Math.round(avgROI),
            costPerLead: totalLeads > 0 ? Math.round((totalCost / totalLeads) * 100) / 100 : 0,
            breakdown: this.getCostBreakdownByType(monthlyEntries)
        };
    }

    // Cost breakdown by content type
    getCostBreakdownByType(entries) {
        const breakdown = {};
        entries.forEach(entry => {
            if (!breakdown[entry.contentType]) {
                breakdown[entry.contentType] = {
                    count: 0,
                    totalCost: 0,
                    avgCost: 0
                };
            }
            breakdown[entry.contentType].count++;
            breakdown[entry.contentType].totalCost += entry.estimatedCost;
        });

        // Calculate averages
        Object.keys(breakdown).forEach(type => {
            breakdown[type].avgCost = 
                Math.round((breakdown[type].totalCost / breakdown[type].count) * 100) / 100;
        });

        return breakdown;
    }

    // Save cost history
    saveCostHistory() {
        try {
            const fs = require('fs');
            fs.writeFileSync('/tmp/client_cost_history.json', JSON.stringify({
                costLog: this.costLog,
                currentSpend: this.currentSpend,
                monthlyBudget: this.monthlyBudget,
                lastUpdated: new Date().toISOString()
            }, null, 2));
        } catch (error) {
            console.error('Error saving cost history:', error);
        }
    }

    // Load cost history
    loadCostHistory() {
        try {
            const fs = require('fs');
            if (fs.existsSync('/tmp/client_cost_history.json')) {
                const data = JSON.parse(fs.readFileSync('/tmp/client_cost_history.json', 'utf8'));
                this.costLog = data.costLog || [];
                this.currentSpend = data.currentSpend || 0;
                this.monthlyBudget = data.monthlyBudget || 40;
            }
        } catch (error) {
            console.error('Error loading cost history:', error);
        }
    }

    // Decision support
    shouldUseSystematicGeneration(content) {
        const cost = this.calculateContentCost(content);
        const budgetStatus = this.checkBudgetStatus();
        const roi = this.calculateROI(cost.estimated, content.expected_leads || 1);

        const decision = {
            recommended: 'systematic',
            confidence: 'high',
            reasoning: [],
            cost: cost.estimated,
            roi: roi
        };

        // Budget check
        if (!budgetStatus.canGenerate) {
            decision.recommended = 'local';
            decision.reasoning.push('Budget exhausted - use local generation');
            decision.confidence = 'high';
            return decision;
        }

        // ROI check
        if (roi < 200) {
            decision.recommended = 'local';
            decision.reasoning.push(`Low ROI (${roi}%) - use local generation`);
            decision.confidence = 'medium';
            return decision;
        }

        // Image requirement check
        if (content.images_required) {
            decision.reasoning.push('Images required - systematic generation needed');
        }

        // High value content
        if (content.searchVolume > 500) {
            decision.reasoning.push('High search volume - justify systematic costs');
        }

        return decision;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClientCostTracker;
} else {
    window.ClientCostTracker = ClientCostTracker;
}

// Example usage
if (require.main === module) {
    const tracker = new ClientCostTracker();
    
    // Test with sample content
    const sampleContent = {
        id: 'test_001',
        contentType: 'Blog Post',
        description: 'Fall Pest Prevention Guide for Illinois Homeowners',
        images_required: true,
        searchVolume: 450,
        expected_leads: 3,
        priority: 'HIGH'
    };

    const costLog = tracker.trackContentCost(sampleContent);
    const budgetStatus = tracker.checkBudgetStatus();
    const decision = tracker.shouldUseSystematicGeneration(sampleContent);

    console.log('\n💰 COST TRACKING DEMO:');
    console.log('📊 Cost Log:', costLog);
    console.log('💳 Budget Status:', budgetStatus);
    console.log('🎯 Generation Decision:', decision);
}