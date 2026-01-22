# {{COMPANY_NAME}} File Management API Reference

## Overview

The {{COMPANY_NAME}} File Management API provides comprehensive webhook-based access to Google Drive, Google Docs, and Airtable operations for content management and automation workflows.

**Base URL**: `{{WEBHOOK_URL}}`  
**Method**: `POST`  
**Content-Type**: `application/json`

## Authentication

The webhook endpoint uses pre-configured credentials for:
- Google Drive OAuth2 (account: "Google Drive account 2")
- Google Docs OAuth2 (account: "Google Docs account 2") 
- Airtable Personal Access Token (account: "Airtable Personal Access Token account 2")

## Request Structure

**Required Parameters** (must be included in every request):
- `operation` (string): Service type - "googledrive", "googledocs", or "airtable"
- `subOperation` (number): Specific operation ID (1-8)

**IMPORTANT**: All requests must use nested body structure:
```json
{
  "body": {
    "operation": "airtable",
    "subOperation": 2,
    // ... other parameters
  }
}
```

**Optional Parameters** (include all for proper routing):
- `baseId` (string): Airtable base ID (default: "appS6XjjRUrELJRgC")
- `tableId` (string): Airtable table ID (default: "tblCR8yF9HHQlDij1")
  - Content table: "tblCR8yF9HHQlDij1"
  - **{{COMPANY_NAME}} Inventory table**: "tblDaJzBBjtR2mrDq"
  - Actions table: "tblGX1h05Nwe9qBQ7"
  - Variables table: "tblCQkDtP3WsKmnk7"
- `recordId` (string): Airtable record ID
- `searchQuery` (string): Google Drive search terms
- `fileId` (string): Google Drive file ID
- `fileName` (string): File name for uploads/copies
- `parentId` (string): Google Drive parent folder ID
- `newParentId` (string): Destination folder for moves
- `newName` (string): New name for copied files
- `email` (string): Email for sharing permissions
- `role` (string): Permission level (viewer, editor, owner)
- `folderName` (string): Name for new folders
- `documentId` (string): Google Docs document ID or URL
- `title` (string): Title for new documents
- `text` (string): Content to insert
- `index` (number): Text insertion position

## Google Drive Operations

### 1. Search Files
**Operation**: `"googledrive"` | **SubOperation**: `1`

**Required Fields**: `searchQuery`

**Example**:
```json
{
  "body": {
    "operation": "googledrive",
    "subOperation": 1,
    "searchQuery": "{{COMPANY_NAME}} marketing content",
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblCR8yF9HHQlDij1",
    "recordId": "recExample",
    "fileId": "1ExampleFileId",
    "fileName": "example.pdf",
    "parentId": "1ParentFolder",
    "newParentId": "1NewFolder",
    "newName": "new_name.pdf",
    "email": "{{CLIENT_EMAIL}}",
    "role": "editor",
    "folderName": "Content Folder",
    "documentId": "1DocId",
    "title": "Document Title",
    "text": "Content text",
    "index": 1
  }
}
```

### 2. Download File
**Operation**: `"googledrive"` | **SubOperation**: `2`

**Required Fields**: `fileId`

### 3. Upload File
**Operation**: `"googledrive"` | **SubOperation**: `3`

**Required Fields**: `fileName`, `parentId`

### 4. Copy File
**Operation**: `"googledrive"` | **SubOperation**: `4`

**Required Fields**: `fileId`, `newName`, `parentId`

### 5. Move File
**Operation**: `"googledrive"` | **SubOperation**: `5`

**Required Fields**: `fileId`, `newParentId`

### 6. Delete File
**Operation**: `"googledrive"` | **SubOperation**: `6`

**Required Fields**: `fileId`

### 7. Share File
**Operation**: `"googledrive"` | **SubOperation**: `7`

**Required Fields**: `fileId`, `email`, `role`

### 8. Create Folder
**Operation**: `"googledrive"` | **SubOperation**: `8`

**Required Fields**: `folderName`, `parentId`

## Google Docs Operations

### 1. Get Document
**Operation**: `"googledocs"` | **SubOperation**: `1`

**Required Fields**: `documentId`

**Example**:
```json
{
  "operation": "googledocs",
  "subOperation": 1,
  "documentId": "1ABC123DocumentId456",
  "baseId": "appS6XjjRUrELJRgC",
  "tableId": "tblCR8yF9HHQlDij1",
  "recordId": "recExample",
  "searchQuery": "search terms",
  "fileId": "1FileId",
  "fileName": "doc.pdf",
  "parentId": "1ParentFolder",
  "newParentId": "1NewFolder",
  "newName": "new_doc.pdf",
  "email": "{{CLIENT_EMAIL}}",
  "role": "editor",
  "folderName": "Docs Folder",
  "title": "Document Title",
  "text": "Document content",
  "index": 1
}
```

### 2. Create Document
**Operation**: `"googledocs"` | **SubOperation**: `2`

**Required Fields**: `title`

**Note**: Creates documents in folder ID "1HWvSO621zqESxPSXtJPyczxjs-NtPXXE"

### 3. Update Document
**Operation**: `"googledocs"` | **SubOperation**: `3`

**Required Fields**: `documentId`, `text`  
**Optional**: `index` (default: 1)

## Airtable Operations

### 1. Get Schema
**Operation**: `"airtable"` | **SubOperation**: `1`

**Required Fields**: `baseId` (optional, defaults to "appS6XjjRUrELJRgC")

**Example**:
```json
{
  "operation": "airtable",
  "subOperation": 1,
  "baseId": "appS6XjjRUrELJRgC",
  "tableId": "tblCR8yF9HHQlDij1",
  "recordId": "recExample",
  "searchQuery": "search terms",
  "fileId": "1FileId",
  "fileName": "file.pdf",
  "parentId": "1ParentFolder",
  "newParentId": "1NewFolder",
  "newName": "new_file.pdf",
  "email": "{{CLIENT_EMAIL}}",
  "role": "editor",
  "folderName": "Folder Name",
  "documentId": "1DocId",
  "title": "Title",
  "text": "Content",
  "index": 1
}
```

### 2. Search Records
**Operation**: `"airtable"` | **SubOperation**: `2`

**Required Fields**: `baseId`, `tableId`  
**Optional**: `maxRecords`, search filters

**Note**: Returns all records from the specified table. Commonly used table IDs:
- Content: "tblCR8yF9HHQlDij1"
- **{{COMPANY_NAME}} Inventory**: "tblDaJzBBjtR2mrDq"

### 3. Get Record
**Operation**: `"airtable"` | **SubOperation**: `3`

**Required Fields**: `baseId`, `tableId`, `recordId`

### 4. Create Record
**Operation**: `"airtable"` | **SubOperation**: `4`

**Required Fields**: `baseId`, `tableId`, `fields` (as object)

**Note**: Fields are mapped via autoMapInputData from the request body

### 5. Update Record
**Operation**: `"airtable"` | **SubOperation**: `5`

**Required Fields**: `baseId`, `tableId`, `recordId`, `fields` (as object)

### 6. Delete Record
**Operation**: `"airtable"` | **SubOperation**: `6`

**Required Fields**: `baseId`, `tableId`, `recordId`

## Response Format

**Success Response**:
```json
{
  "message": "Workflow was started"
}
```

**Error Responses**:
- Invalid JSON: Returns HTML error page
- Missing parameters: Workflow execution failure
- Authentication issues: Service-specific error messages

## Usage Examples

### {{COMPANY_NAME}} Content Creation Workflow

**1. Search for existing content**:
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "googledrive",
    "subOperation": 1,
    "searchQuery": "{{COMPANY_NAME}} spring pest prevention",
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblCR8yF9HHQlDij1",
    "recordId": "",
    "fileId": "",
    "fileName": "",
    "parentId": "",
    "newParentId": "",
    "newName": "",
    "email": "",
    "role": "",
    "folderName": "",
    "documentId": "",
    "title": "",
    "text": "",
    "index": 1
  }'
```

**2. Create new {{COMPANY_NAME}} document**:
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "googledocs",
    "subOperation": 2,
    "title": "{{COMPANY_NAME}} Spring Pest Prevention Guide 2025",
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblCR8yF9HHQlDij1",
    "recordId": "",
    "searchQuery": "",
    "fileId": "",
    "fileName": "",
    "parentId": "",
    "newParentId": "",
    "newName": "",
    "email": "",
    "role": "",
    "folderName": "",
    "documentId": "",
    "text": "",
    "index": 1
  }'
```

**3. Track content in Airtable**:
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "airtable",
    "subOperation": 4,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblCR8yF9HHQlDij1",
    "recordId": "",
    "searchQuery": "",
    "fileId": "",
    "fileName": "",
    "parentId": "",
    "newParentId": "",
    "newName": "",
    "email": "",
    "role": "",
    "folderName": "",
    "documentId": "",
    "title": "",
    "text": "",
    "index": 1
  }'
```

## Integration Notes

### Content Management Automation
- All operations support {{COMPANY_NAME}} content lifecycle management
- Google Drive for file storage and organization
- Google Docs for content creation and editing
- Airtable for content tracking and metadata

### Workflow Routing
- Uses n8n switch nodes for operation routing
- Webhook triggers execute workflow based on operation/subOperation
- Each service has dedicated credential management

### Default Configuration
- **Airtable Base**: "appS6XjjRUrELJRgC" ({{COMPANY_NAME}} Content Management)
- **Airtable Table**: "tblCR8yF9HHQlDij1" (Content Tracking)
- **Google Docs Folder**: "1HWvSO621zqESxPSXtJPyczxjs-NtPXXE" ({{COMPANY_NAME}} Documents)

## Error Handling

### Common Issues
1. **Missing Variables**: Ensure all parameters are included in request
2. **Invalid Credentials**: Check Google/Airtable authentication
3. **File Not Found**: Verify fileId/documentId/recordId exists
4. **Permission Denied**: Check sharing permissions for operations

### Debugging
- All operations return "Workflow was started" on successful trigger
- Check n8n execution logs for detailed error information
- Verify webhook is active in n8n interface

## Maintenance

### Credential Management
- Google Drive OAuth2: Refresh tokens managed automatically
- Google Docs OAuth2: Shared with Drive credentials
- Airtable Token: Personal access token with base permissions

### Workflow Updates
- Webhook endpoint: `claudecode` path
- Response handling: Uses `respondToWebhook` nodes
- Binary responses: Available for file downloads

## {{COMPANY_NAME}} Content Inventory Examples

### Search All Content in Inventory
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "airtable",
    "subOperation": 2,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblDaJzBBjtR2mrDq"
  }'
```

### Get Specific Content Item
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "airtable",
    "subOperation": 3,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblDaJzBBjtR2mrDq",
    "recordId": "recpruyizyq1XwfCU"
  }'
```

### Update Content Status
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "airtable",
    "subOperation": 4,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblDaJzBBjtR2mrDq",
    "recordId": "recpruyizyq1XwfCU",
    "fields": {
      "Status": "🔄 In Progress",
      "{{CLIENT_CONTACT}} Notes": "Started content creation"
    }
  }'
```

### Create New Content Item
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "airtable",
    "subOperation": 3,
    "baseId": "appS6XjjRUrELJRgC",
    "tableId": "tblDaJzBBjtR2mrDq",
    "fields": {
      "Content Title": "New Blog Post Title",
      "Content Type": "Blog Post",
      "Priority Level": "HIGH",
      "Status": "⏳ Planned",
      "Target Location": "Dixon IL",
      "Pest Type": "Bed Bugs",
      "Primary Keyword": "bed bug treatment Dixon IL",
      "Content Format": "WordPress Blog",
      "Seasonal Relevance": "Year-Round"
    }
  }'
```

### Common {{COMPANY_NAME}} Inventory Fields
- **Content Title**: Descriptive title (e.g., "Bed Bug Control Dixon IL")
- **Content Type**: Blog Post, Social Media, Location Page
- **Priority Level**: HIGH, MEDIUM, LOW
- **Status**: ⏳ Planned, 🔄 In Progress, 📋 {{CLIENT_CONTACT}} Review, ✅ Complete
- **Target Location**: Dixon IL, Sycamore IL, Clinton IA, etc.
- **Pest Type**: Bed Bugs, Ants, Termites, Rodents, General
- **Content Format**: WordPress Blog, Facebook Post, Instagram Post, Landing Page
- **{{CLIENT_CONTACT}} Notes**: Text field for feedback and instructions

This API enables comprehensive file management automation for the {{COMPANY_NAME}} content creation and marketing workflow system.