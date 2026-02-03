# {{COMPANY_NAME}} Webhook Integration Debugging Guide

## 🚨 CRITICAL ISSUES IDENTIFIED

### Issue #1: Incorrect Webhook URL
**Problem**: Documentation shows incorrect webhook URL
- **Incorrect**: `{{OLD_WEBHOOK_URL}}`
- **Correct**: `{{WEBHOOK_URL}}`

### Issue #2: Request Body Structure
**Problem**: N8N workflow expects nested body structure
- **Current**: `$json.body.operation`  
- **Expected**: `$json.body.body.operation`

**Required Request Structure**:
```json
{
  "body": {
    "operation": "airtable",
    "subOperation": 2,
    "baseId": "YOUR_BASE_ID",
    "tableId": "YOUR_INVENTORY_TABLE_ID",
    // ... all other parameters
  }
}
```

### Issue #3: Webhook Activation Status
**Problem**: N8N workflow may not be active
- 404 error suggests workflow is inactive or URL mismatch

---

## 🔧 CORRECTED API CALLS

### Correct Airtable Inventory Access
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 2,
      "baseId": "YOUR_BASE_ID",
      "tableId": "YOUR_INVENTORY_TABLE_ID",
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
    }
  }'
```

### Test Webhook Connectivity
```bash
curl -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "operation": "airtable",
      "subOperation": 1,
      "baseId": "YOUR_BASE_ID"
    }
  }'
```

---

## 📊 N8N WORKFLOW ANALYSIS

### Current Configuration
- **Webhook Path**: `claudecode` ✅
- **Response Mode**: `responseNode` ✅  
- **Operation Routing**: 3-tier switch system ✅
  1. Main Switch: Routes by operation type (googledrive|googledocs|airtable)
  2. Sub Switches: Route by subOperation number (1-8)
  3. Action Nodes: Execute specific operations

### Expected Data Flow
```
POST /webhook/claudecode
↓
Main Switch (checks $json.body.body.operation)
↓
Service Switch (checks $json.body.body.subOperation)  
↓
Action Node (executes operation)
↓
Response Node (returns result)
```

---

## 🛠️ DEBUGGING STEPS

### Step 1: Verify Webhook Status
1. Check N8N dashboard for workflow activation
2. Ensure webhook is published and active
3. Test with minimal payload to confirm connectivity

### Step 2: Test Request Structure
```bash
# Test minimal request
curl -v -X POST https://sdallc.app.n8n.cloud/webhook/claudecode \
  -H "Content-Type: application/json" \
  -d '{"body":{"operation":"airtable","subOperation":1}}'
```

### Step 3: Debug Response Patterns
- Success: Returns data or "Workflow was started"
- Auth Error: Service-specific error messages
- Structure Error: Workflow execution failure
- URL Error: 404 "webhook not registered"

### Step 4: Authentication Verification
**Google Services**: OAuth2 tokens may need refresh
- Google Drive account: "FLFBgEygCAvrNPeh" 
- Google Docs account: "EtHekPw1zvU8bJZO"

**Airtable**: Personal access token validation
- Account: "Y4P1MjOzZCPWJn8W"
- Base access: "YOUR_BASE_ID"

---

## 🚀 OPTIMIZATION IMPROVEMENTS

### Enhanced Error Handling
Add error handling nodes to catch and report:
- Invalid operation/subOperation combinations
- Missing required fields
- Authentication failures
- Service timeouts

### Request Validation
Add validation node to check:
- Required parameters present
- Valid operation types
- Proper data types

### Response Standardization
Standardize all responses to include:
- Success/failure status
- Error messages when applicable  
- Execution metadata
- Timing information

---

## ⚡ PERFORMANCE IMPROVEMENTS

### Current Issues Causing 80% Success Rate

1. **Authentication Token Expiry**
   - Solution: Auto-refresh OAuth tokens
   - Implementation: Add token validation nodes

2. **Request Structure Mismatch**  
   - Solution: Document correct body format
   - Implementation: Add request transformation if needed

3. **Service Rate Limits**
   - Solution: Add retry logic with exponential backoff
   - Implementation: Error handling with delay nodes

4. **Timeout Issues**
   - Solution: Increase timeout settings
   - Implementation: Configure longer timeouts for slow operations

### Target: 95%+ Success Rate
- Fix URL and body structure issues
- Add robust error handling
- Implement retry mechanisms
- Monitor and alert on failures

---

## 📋 TESTING CHECKLIST

### Basic Connectivity
- [ ] Webhook responds to POST requests
- [ ] Returns proper HTTP status codes
- [ ] Handles malformed JSON gracefully

### Airtable Operations
- [ ] Get Schema (subOperation: 1)
- [ ] List Records (subOperation: 2) 
- [ ] Get Record (subOperation: 3)
- [ ] Create Record (subOperation: 4)
- [ ] Update Record (subOperation: 5)
- [ ] Delete Record (subOperation: 6)

### Google Drive Operations
- [ ] Search (subOperation: 1)
- [ ] Download (subOperation: 2)
- [ ] Upload (subOperation: 3)
- [ ] Copy (subOperation: 4)
- [ ] Move (subOperation: 5)
- [ ] Delete (subOperation: 6)
- [ ] Share (subOperation: 7)
- [ ] Create Folder (subOperation: 8)

### Google Docs Operations
- [ ] Get Document (subOperation: 1)
- [ ] Create Document (subOperation: 2)
- [ ] Update Document (subOperation: 3)

---

## 🔍 MONITORING & MAINTENANCE

### Key Metrics to Track
- Request success rate by operation type
- Response time by service
- Authentication failure rate  
- Most common error types

### Regular Maintenance Tasks
- Weekly: Review error logs and success rates
- Monthly: Validate authentication tokens
- Quarterly: Update documentation and test all operations

---

**Next Actions:**
1. Update all API documentation with correct webhook URL
2. Test corrected webhook calls
3. Implement error handling improvements
4. Set up monitoring for webhook performance

*This guide should bring webhook success rate from 80% to 95%+*