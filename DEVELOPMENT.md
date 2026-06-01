# Development Guide

This document provides guidance for developers working on the D365 Finance Configuration Extractor extension.

## 🛠️ Setup

### Prerequisites:
- Chrome or Edge browser (version 88+)
- Git
- Text editor or IDE (VS Code recommended)
- Basic knowledge of JavaScript

### Development Setup:

1. **Clone the repository**:
```bash
git clone <repo-url>
cd Dynamics365Finance
```

2. **Load extension in Chrome**:
   - Open `chrome://extensions/`
   - Toggle **Developer Mode** (top-right)
   - Click **Load unpacked**
   - Select the project directory

3. **Enable logging**:
   - Open `chrome://extensions/`
   - Click **Details** on the extension
   - Check extension background page console

## 📁 File Structure & Responsibilities

### src/popup/
- **popup.html**: Extension UI markup
  - Form for entity/LE selection
  - Progress display
  - Results view
  
- **popup.css**: Styling
  - Uses Fluent Design tokens
  - Responsive layout
  
- **popup.js**: UI logic
  - Form event handling
  - Communication with background/content
  - Progress polling

### src/content/
- **content.js**: D365F page context script
  - Detects legal entities from page
  - Fetches data via OData APIs
  - Communicates with background service

### src/background/
- **background.js**: Service worker
  - Main extraction engine
  - Coordinates multi-LE extraction
  - Manages exports
  - Handles downloads
  - Uses IndexedDB for storage

### src/utils/
- **exporters.js**: Export format handlers
  - `ExportManager` class
  - Methods: exportToExcel, exportToCSV, exportToJSON, exportToText
  - Data transformation logic
  
- **comparator.js**: Comparison engine
  - `ConfigComparator` class
  - Detects differences across LEs
  - Generates comparison reports

### src/constants/
- **entities.js**: Entity definitions
  - D365F_ENTITIES: Entity metadata
  - ODATA_ENDPOINTS: API paths
  - ENTITY_RELATIONSHIPS: Dependencies

## 🔄 Message Flow

### Chrome Message Passing:

```
Popup → Content Script
  {action: 'getLegalEntities'}

Content Script → Popup
  {success: true, data: [{value: 'USPM', label: 'US Primary'}, ...]}

Popup → Background Service Worker
  {action: 'initializeExtraction', legalEntities, entities, formats}

Popup ← Background Service Worker (poll)
  {action: 'getExtractionStatus'} 
  ← {isExtracting, percentage, message, details, results}
```

## 🧪 Testing

### Manual Testing Checklist:

**1. Legal Entity Loading**:
- [ ] Navigate to D365F
- [ ] Open extension
- [ ] Verify legal entities appear in list
- [ ] Test "Select All" / "Clear All"

**2. Extraction (Single LE)**:
- [ ] Select 1 LE, 3 entities, Excel format
- [ ] Click "Extract Configuration"
- [ ] Verify progress updates
- [ ] Wait for completion
- [ ] Download file

**3. Extraction (Multiple LEs)**:
- [ ] Select 5+ LEs, all entities, all formats
- [ ] Run extraction
- [ ] Monitor progress
- [ ] Verify all format downloads

**4. Comparison**:
- [ ] Extract 2+ LEs with comparison enabled
- [ ] Verify comparison sheet in Excel
- [ ] Check difference highlighting
- [ ] Validate missing entity detection

**5. Export Formats**:
- [ ] Extract to Excel - verify sheets load
- [ ] Extract to CSV - verify data integrity
- [ ] Extract to JSON - validate JSON format
- [ ] Extract to Text - check readability

### Debug Mode:

Enable debug logging in `background.js`:

```javascript
const DEBUG = true;

function log(...args) {
    if (DEBUG) console.log('[D365-Extractor]', ...args);
}
```

### Debugging with DevTools:

1. **Popup Script**:
   - Right-click extension icon → Inspect
   - Open DevTools
   - View popup.js console

2. **Content Script**:
   - Navigate to D365F page
   - Press F12
   - Content script errors show in Console
   - Search for "content.js"

3. **Background Service Worker**:
   - Open `chrome://extensions/`
   - Click extension details
   - Click "Background page"
   - DevTools opens for service worker

## 📝 Code Style Guide

### Naming Conventions:
```javascript
// Classes: PascalCase
class ExportManager { }

// Functions & variables: camelCase
function extractEntity() { }
const legalEntities = [];

// Constants: UPPER_SNAKE_CASE
const MAX_BATCH_SIZE = 20;
const API_BASE_URL = '/_odata/v1';

// Private methods: _leadingUnderscore
function _escapeCSV(value) { }
```

### Comments:
- Use for non-obvious logic only
- Avoid commenting what the code does
- Focus on why

```javascript
// Good: Explains the why
// Batch size limited to 20 to prevent D365F OData timeout (5 min limit)
const BATCH_SIZE = 20;

// Bad: Just states what it does
// This is the batch size
const BATCH_SIZE = 20;
```

### Error Handling:
```javascript
try {
    const data = await fetchData();
    return { success: true, data };
} catch (error) {
    console.error('Fetch failed:', error);
    return { success: false, error: error.message };
}
```

## 🚀 Feature Development

### Adding a New Entity:

1. **Update entities.js**:
```javascript
'NewEntity': {
    name: 'NewEntity',
    displayName: 'New Entity',
    category: 'Category',
    odataCollection: 'NewEntityCollection',
    description: 'Description'
}
```

2. **Update popup.html**:
```html
<label class="checkbox-item">
    <input type="checkbox" name="entity" value="NewEntity">
    <span>New Entity</span>
</label>
```

3. **Test extraction**:
   - Extract with new entity selected
   - Verify data in all export formats
   - Check comparison report

### Adding a New Export Format:

1. **Add method to ExportManager** (exporters.js):
```javascript
static async exportToXML(data, filename = 'export.xml') {
    const xml = this._generateXML(data);
    return {
        filename,
        content: xml,
        type: 'application/xml'
    };
}

static _generateXML(data) {
    // Implementation
}
```

2. **Add UI option** (popup.html):
```html
<label class="checkbox-item">
    <input type="checkbox" name="format" value="xml">
    <span>XML (.xml)</span>
</label>
```

3. **Handle in background.js**:
```javascript
case 'xml':
    fileContent = convertToXML(data);
    fileName = `d365-config-export-${timestamp}.xml`;
    fileType = 'application/xml';
    break;
```

## 🔗 API Integration Notes

### OData Endpoints:

The extension uses D365F OData v1 API:

```
Base: /_odata/v1/
Examples:
  /_odata/v1/Ledgers
  /_odata/v1/MainAccounts
  /_odata/v1/LedgerParameters?$filter=DataAreaId eq 'USPM'
```

### Authentication:

Uses current browser session (cookie-based). No additional tokens needed.

### Rate Limiting:

D365F OData endpoint has ~5 minute timeout. Batch requests to avoid:
```javascript
// Good: Batch by LE, max 20 per request
for (let i = 0; i < legalEntities.length; i += 20) {
    const batch = legalEntities.slice(i, i + 20);
    await Promise.all(batch.map(le => extractLE(le)));
}

// Bad: Sequential, very slow
for (const le of legalEntities) {
    await extractLE(le);
}
```

## 📦 Building for Distribution

### Create Package:

```bash
# Create zip file for Chrome Web Store
# Exclude: .git, node_modules, DEVELOPMENT.md, .gitignore
# Include: All src/, manifest.json, README.md, icons/

zip -r d365-extractor.zip . \
  -x ".git/*" "node_modules/*" "DEVELOPMENT.md" ".gitignore"
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Check that content script loaded successfully
```javascript
// In popup.js
chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
        console.error('Content script not loaded:', chrome.runtime.lastError);
    }
});
```

### Issue: CORS errors when fetching from OData
**Solution**: Content script runs in page context, not isolated
- OData calls work because they're same-origin
- Verify page origin matches D365F domain

### Issue: Large dataset causes memory issues
**Solution**: Use IndexedDB for persistent storage
```javascript
await chrome.storage.local.set({ [key]: largeData });
```

### Issue: Extraction hangs on certain LEs
**Solution**: Implement timeout handling
```javascript
const timeout = Promise.race([
    fetchData(),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
    )
]);
```

## 📚 Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [D365 OData Documentation](https://docs.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/data-entities-odata)
- [Message Passing Guide](https://developer.chrome.com/docs/extensions/mv3/messaging/)

## 🎯 Development Priorities

Current focus areas:
1. OData integration for real D365F environments
2. Excel export with xlsx library
3. Comparison algorithm optimization
4. UI/UX refinement based on feedback
5. Performance testing with 100+ LEs

## ✅ Pre-Release Checklist

Before submitting to app store:
- [ ] All features tested with real D365F
- [ ] No hardcoded test data in production
- [ ] Documentation complete and accurate
- [ ] Privacy policy includes data handling
- [ ] Security review completed
- [ ] Performance tested with 100+ LEs
- [ ] No console errors on standard use case
- [ ] Icons optimized and branded
- [ ] Version number updated
