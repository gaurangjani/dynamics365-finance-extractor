# Debugging Legal Entities Loading

If legal entities are not loading correctly or showing wrong values, use these debugging steps:

## 1. Open Browser Developer Console

Press `F12` to open the developer tools, then go to the **Console** tab.

## 2. Check Available Debug Functions

The extension exposes a debug object: `window.D365ConfigDebug`

### Get Current Sidebar State
```javascript
window.D365ConfigDebug.getSidebarState()
```
This will show you the current loaded legal entities.

### Get Page Company Elements
```javascript
window.D365ConfigDebug.getPageCompanies()
```
This will show all company/entity selectors found on the page with their values.

### Test OData Endpoint
```javascript
window.D365ConfigDebug.testODataCall()
```
This tests the OData endpoint and shows the response.

You can also test a specific endpoint:
```javascript
window.D365ConfigDebug.testODataCall('/_odata/v1/CompanyInfo?$select=DataAreaId,Name&$top=100')
```

### Reload Legal Entities
```javascript
window.D365ConfigDebug.reloadLegalEntities()
```
This manually triggers a reload of legal entities.

## 3. Check Console Logs

Look for log messages starting with:
- ✓ = Success
- ⚠ = Warning
- ✗ = Error

These will tell you which method successfully loaded legal entities (OData or page extraction).

## Common Issues and Solutions

### Issue: Shows "Current companyAfter the lookup is open..."
**Cause**: Extracting text from tooltip or help text instead of actual legal entity names
**Solution**: Make sure OData endpoint is working. Check step 2 above.

### Issue: Empty legal entity list
**Cause**: OData endpoint unreachable or returns no data
**Solution**: 
1. Test the OData endpoint with the debug function
2. Check if the D365F instance supports OData API
3. Verify authentication (ensure you're logged into D365F)

### Issue: Wrong company values in selection
**Cause**: OData returns data but with different structure than expected
**Solution**: Check the OData response format with the debug function and verify the DataAreaId field exists

## OData Endpoints Attempted (in order)

1. `/_odata/v1/CompanyInfo?$select=DataAreaId,Name&$top=100`
2. `/_odata/v1/CompanyInfo?$top=100` (full object)
3. `/_odata/v1/Organization?$select=OrganizationId,Name&$top=100`

If all OData attempts fail, the system falls back to:
- Extracting from page elements (selectors, dropdowns)
- Using hardcoded mock data (USPM, USMF, etc.)

## What to Report if Issues Persist

If legal entities still don't load correctly, please provide:

1. Browser console output showing the debug logs
2. Result of: `window.D365ConfigDebug.getPageCompanies()`
3. Result of: `window.D365ConfigDebug.testODataCall()`
4. Your D365F instance URL and whether it's cloud or on-premises
5. Browser version
