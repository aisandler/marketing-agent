# {{COMPANY_NAME}} Webhook API Documentation

**Endpoint**: `{{WEBHOOK_URL}}`  
**Purpose**: Complete integration system for Airtable records, Google Drive file management, and Google Docs operations  
**Created**: August 19, 2025  

---

## 🔗 CONTENT ID CORRELATION SYSTEM

### Critical Concept: Content ID = File Organization Key
**Every Airtable Content ID directly correlates to Google Drive folder structure and file naming:**

- **Airtable Record**: Content ID "C118"
- **Google Drive Folder**: `/{{COMPANY_NAME}} Content/C118_September_Seasonal_Posts/`
- **File Names**: `C118_Instagram_Post.docx`, `C118_Facebook_Version.docx`, `C118_Content_Brief.pdf`

This correlation ensures seamless organization where:
1. Content planning happens in Airtable with unique Content IDs
2. File creation uses Content ID for naming and folder structure  
3. Content retrieval is instant using Content ID as reference key
4. Version control and updates maintain ID-based organization

---

## 📋 AIRTABLE OPERATIONS

### Base Configuration
- **Base ID**: `YOUR_BASE_ID`
- **Table ID**: `YOUR_CONTENT_TABLE_ID` *(Correct table ID as of August 2025)*
- **Primary Use**: Content planning, status tracking, workflow management

### Operation 1: List All Records
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 2,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID"
    }
  }'
```

### Operation 2: Get Specific Record
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 3,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "recordId": "recXXXXXXXXXXXXXXX"
    }
  }'
```

### Operation 3: Create New Record
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 4,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "fields": {
        "Description": "September Seasonal Maintenance Tips",
        "Content Type": "Social Media",
        "Priority": "HIGH",
        "Target Location": "Multi-State",
        "Service Category": "General",
        "Content Format": "Instagram Post",
        "Seasonal Relevance": "Fall",
        "Primary Keyword": "fall home maintenance tips",
        "Search Volume": 320,
        "Keyword Difficulty": "Low",
        "Notes": "Location-agnostic per {{CLIENT_CONTACT}} rules"
      }
    }
  }'
```

### Operation 4: Update Existing Record
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 5,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "recordId": "recXXXXXXXXXXXXXXX",
      "fields": {
        "Status": "🔄 In Progress",
        "Notes": "{{CLIENT_CONTACT}} approved - ready for content generation"
      }
    }
  }'
```

### Operation 5: Delete Record
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 6,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "recordId": "recXXXXXXXXXXXXXXX"
    }
  }'
```

---

## 📁 GOOGLE DRIVE OPERATIONS

### Drive Structure for {{COMPANY_NAME}} Content
```
/{{COMPANY_NAME}} Content Library/
├── Blog Posts/
│   ├── C001_Springfield_Service_Guide/
│   ├── C002_Riverside_Prevention_Tips/
│   └── [Content ID]_[Brief Description]/
├── Social Media/
│   ├── Instagram/
│   │   ├── C118_September_Seasonal_Tips/
│   │   └── [Content ID]_[Post Theme]/
│   └── Facebook/
│       ├── C119_Fall_Service_Alert/
│       └── [Content ID]_[Post Theme]/
├── Location Pages/
│   ├── C200_Lakewood_Landing/
│   └── [Content ID]_[City]_Landing/
└── Templates/
    ├── Brand Guidelines/
    └── Content Templates/
```

### Operation 1: Search Files
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 1,
      "searchQuery": "name contains \"C118\" and parents in \"1{{COMPANY_NAME}}_Content_Folder_ID\""
    }
  }'
```

### Operation 2: Download File
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 2,
      "fileId": "1ExampleFileId_C118_Content"
    }
  }'
```

### Operation 3: Upload File (Content ID Based)
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 3,
      "fileName": "C118_Instagram_Seasonal_Tips.docx",
      "parentId": "1{{COMPANY_NAME}}_Social_Media_Folder_ID",
      "fileContent": "[Base64 encoded file content]"
    }
  }'
```

### Operation 4: Create Folder (Content ID Based)
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 8,
      "folderName": "C118_September_Seasonal_Tips",
      "parentId": "1{{COMPANY_NAME}}_Instagram_Folder_ID"
    }
  }'
```

### Operation 5: Copy File Template (Content ID Naming)
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 4,
      "fileId": "1Template_Instagram_Post_ID",
      "newName": "C118_Instagram_Seasonal_Tips.docx",
      "parentId": "1{{COMPANY_NAME}}_Content_Working_Folder"
    }
  }'
```

---

## 📝 GOOGLE DOCS OPERATIONS

### Document Creation with Content ID Integration
Google Docs operations create content documents that correlate directly with Airtable Content IDs for seamless workflow management.

### Operation 1: Get Document Content
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledocs",
      "subOperation": 1,
      "documentId": "1C118_Instagram_Content_Doc_ID"
    }
  }'
```

### Operation 2: Create New Document (Content ID Based)
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledocs",
      "subOperation": 2,
      "title": "C118_September_Seasonal_Tips_Instagram_Post",
      "parentId": "1{{COMPANY_NAME}}_Instagram_Content_Folder"
    }
  }'
```

### Operation 3: Update Document Content
```bash
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledocs",
      "subOperation": 3,
      "documentId": "1C118_Content_Document_ID",
      "text": "🍂 FALL HOME MAINTENANCE TIPS\n\nAs temperatures drop, it's time to prepare your home for the season ahead. Here are 3 simple steps to protect your property:\n\n1. Inspect and seal gaps around windows and doors\n2. Schedule your seasonal maintenance check\n3. Address any moisture issues in basements\n\nDon't wait until small problems become big ones. Our professional services keep your home protected all season long.\n\n📞 Call {{PHONE_NUMBER}} for your FREE consultation\n🛡️ {{PRIMARY_TAGLINE}}\n\n#HomeMaintenance #FallPrep #SeasonalService #FamilySafety #ProfessionalService",
      "index": 1
    }
  }'
```

---

## 🔄 INTEGRATED WORKFLOW EXAMPLES

### Complete Content Creation Workflow

#### Step 1: Create Airtable Record
```bash
# Creates new record - system assigns Content ID (e.g., C125)
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 4,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "fields": {
        "Description": "Winter Home Maintenance Prevention Guide",
        "Content Type": "Blog Post",
        "Priority": "HIGH",
        "Target Location": "Springfield IL",
        "Service Category": "General"
      }
    }
  }'
```

#### Step 2: Create Content Folder (Using Generated Content ID)
```bash
# Create organized folder using Content ID from Step 1
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 8,
      "folderName": "C125_Winter_Maintenance_Guide",
      "parentId": "1{{COMPANY_NAME}}_Blog_Posts_Folder_ID"
    }
  }'
```

#### Step 3: Create Working Document
```bash
# Create Google Doc with Content ID naming
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledocs",
      "subOperation": 2,
      "title": "C125_Winter_Maintenance_Guide_Blog",
      "parentId": "1C125_Folder_ID_From_Step2"
    }
  }'
```

#### Step 4: Update Airtable Status
```bash
# Mark as in progress with Google Doc link
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 5,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "recordId": "recC125_Record_ID",
      "fields": {
        "Status": "🔄 In Progress",
        "Notes": "Google Doc created: C125_Winter_Maintenance_Guide_Blog"
      }
    }
  }'
```

### Bulk Content Organization Workflow

#### Scenario: Organize All September Instagram Posts
```bash
# 1. List all September Instagram records from Airtable
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 2,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "filterByFormula": "AND({Content Format} = \"Instagram Post\", {Seasonal Relevance} = \"Fall\")"
    }
  }'

# 2. For each Content ID returned (C118, C119, C120, etc.):
# Create individual folders
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 8,
      "folderName": "C118_September_Seasonal_Tips",
      "parentId": "1{{COMPANY_NAME}}_Instagram_September_Folder"
    }
  }'

# 3. Copy template documents with Content ID naming
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 4,
      "fileId": "1Instagram_Post_Template_ID",
      "newName": "C118_Instagram_Seasonal_Tips_DRAFT.docx",
      "parentId": "1C118_Folder_ID"
    }
  }'
```

---

## 🏗️ CONTENT ID NAMING CONVENTIONS

### File Naming Schema
**Pattern**: `[Content_ID]_[Content_Type]_[Brief_Description].[extension]`

**Examples**:
- `C118_Instagram_Seasonal_Tips.docx`
- `C125_Blog_Winter_Maintenance_Guide.docx`
- `C200_Landing_Lakewood_Service.html`
- `C301_Facebook_Fall_Service_Alert.docx`

### Folder Naming Schema
**Pattern**: `[Content_ID]_[Brief_Description]/`

**Examples**:
- `C118_September_Seasonal_Tips/`
- `C125_Winter_Maintenance_Guide/`
- `C200_Lakewood_Landing_Page/`

### Document Title Schema (Google Docs)
**Pattern**: `[Content_ID]_[Content_Type]_[Target]_[Brief_Description]`

**Examples**:
- `C118_Instagram_Multi_State_Seasonal_Tips`
- `C125_Blog_Springfield_IL_Winter_Maintenance_Guide`
- `C200_Landing_Lakewood_IL_Service_Page`

---

## 🔍 SEARCH AND RETRIEVAL PATTERNS

### Find Content by Content ID
```bash
# Search all {{COMPANY_NAME}} content for specific Content ID
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 1,
      "searchQuery": "name contains \"C118\" and parents in \"1{{COMPANY_NAME}}_Content_Library_ID\""
    }
  }'
```

### Find Content by Type and Month
```bash
# Search for all Instagram posts created in September
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 1,
      "searchQuery": "name contains \"Instagram\" and name contains \"September\" and parents in \"1{{COMPANY_NAME}}_Social_Media_ID\""
    }
  }'
```

### Cross-Reference Airtable and Drive Content
```bash
# 1. Get Airtable records with specific criteria
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 2,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_CONTENT_TABLE_ID",
      "filterByFormula": "{Status} = \"✅ Complete\""
    }
  }'

# 2. For each Content ID returned, search Google Drive
curl -X POST {{WEBHOOK_URL}} \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "googledrive",
      "subOperation": 1,
      "searchQuery": "name contains \"[CONTENT_ID_FROM_AIRTABLE]\""
    }
  }'
```

---

## 📋 REQUIRED VARIABLES FOR ALL REQUESTS

**Critical**: All webhook requests must include ALL variables even if not used for the specific operation.

```json
{
  "body": {
    "operation": "[airtable|googledrive|googledocs]",
    "subOperation": "[operation_number]",
    "baseId": "YOUR_BASE_ID",
    "tableId": "YOUR_CONTENT_TABLE_ID",
    "recordId": "recXXXXXXXXXXXXXXX",
    "fileId": "1ExampleFileId",
    "fileName": "C###_Content_Name.ext",
    "parentId": "1ParentFolderId",
    "newParentId": "1NewParentFolderId",
    "newName": "C###_Updated_Name.ext",
    "email": "{{CLIENT_EMAIL}}",
    "role": "editor",
    "folderName": "C###_Folder_Name",
    "documentId": "1DocumentId",
    "title": "C###_Document_Title",
    "text": "Document content...",
    "index": 1,
    "searchQuery": "search terms",
    "fields": {
      "Airtable_Field_Name": "value"
    }
  }
}
```

---

## ✅ WORKFLOW TESTING CHECKLIST

### Pre-Implementation Validation
- [ ] Verify correct Airtable Base ID: `YOUR_BASE_ID`
- [ ] Verify correct Table ID: `YOUR_CONTENT_TABLE_ID`
- [ ] Test webhook endpoint accessibility
- [ ] Confirm Google Drive folder structure exists
- [ ] Validate Content ID auto-generation in Airtable

### Content Creation Test
- [ ] Create test Airtable record
- [ ] Verify Content ID assignment (e.g., C###)
- [ ] Create Google Drive folder using Content ID
- [ ] Create Google Doc with Content ID naming
- [ ] Update Airtable record with file references
- [ ] Verify searchability using Content ID

### Integration Validation
- [ ] Test Airtable → Google Drive file creation
- [ ] Test Google Drive → Airtable status updates
- [ ] Verify Content ID correlation across systems
- [ ] Test bulk operations with multiple Content IDs
- [ ] Validate search and retrieval using Content IDs

---

**Last Updated**: August 19, 2025  
**Next Review**: After first production workflow implementation  
**Critical Note**: Content ID correlation is the foundation of the entire {{COMPANY_NAME}} content management system - maintain this relationship in all operations.