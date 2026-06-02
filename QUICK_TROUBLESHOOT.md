# Quick Troubleshooting - Legal Entities

## Problem: Showing "Current companyAfter the lookup is open..."

### Quick Fix
1. Press `F12` to open DevTools → Console
2. Run: `window.D365ConfigDebug.reloadLegalEntities()`
3. Wait 2 seconds and close/reopen sidebar

## Problem: Empty Legal Entity List

### Quick Fix
1. Check: `window.D365ConfigDebug.testODataCall()`
   - Shows `"data":{"value":[]}` = OData returns no data
   - Shows `error` = OData endpoint not accessible

2. **If OData fails:**
   ```javascript
   window.D365ConfigDebug.getPageCompanies()
   ```
   - If this shows options, page extraction should work
   - Try reloading: `window.D365ConfigDebug.reloadLegalEntities()`

## Problem: Still Showing Wrong Values

### Debug Steps
1. Check all available data:
   ```javascript
   window.D365ConfigDebug.getPageCompanies()
   // Shows all company selectors on page
   ```

2. Check what the system loaded:
   ```javascript
   window.D365ConfigDebug.getSidebarState()
   // Shows sidebarState.legalEntities array
   ```

3. Test each OData endpoint:
   ```javascript
   window.D365ConfigDebug.testODataCall('/_odata/v1/CompanyInfo')
   ```

## Solution Priority

1. **If OData returns data** → Should work now
   - Reload the sidebar

2. **If OData fails but page has dropdowns** → Should fallback to page extraction
   - Reload the sidebar

3. **If both fail** → Falls back to mock data
   - You'll see: USPM, USMF, JPMF, etc.
   - This is expected behavior when system can't find real entities

## Expected Legal Entity Formats

**Common Patterns:**
- `USPM` (2-4 letter codes)
- `DAT` (abbreviations)
- `100`, `200` (numeric codes)
- `Company-001` (with separators)

**NOT Expected:**
- Help text
- Long sentences
- More than 50 characters

## One-Line Test Script

```javascript
var r=window.D365ConfigDebug; console.log({state:r.getSidebarState(), page:r.getPageCompanies(), odata:await r.testODataCall()})
```

This shows everything at once.

## If Problems Persist

Check the console for ERROR messages (red text). These will tell you exactly what went wrong.

Common errors:
- `403 Unauthorized` = Authentication issue
- `404 Not Found` = OData endpoint doesn't exist
- `CORS error` = Cross-origin issue
- `timeout` = Server not responding

Report any ERROR messages you see for faster resolution.
