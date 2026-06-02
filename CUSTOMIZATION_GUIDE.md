# Customization Guide - Adding D365F Configuration Entities

## Quick Start: Adding a New Entity

### Step 1: Identify the Entity Name
Find the OData entity name from:
- D365F Help/Lookup documentation
- OData metadata (`/_odata/v1/$metadata`)
- PowerBI connector field list
- Excel connector entity list

**Example:** To extract customer master records, use `CustTable`

### Step 2: Add to Module Mapping
Edit `src/sidebar/sidebar.js` around line 572:

```javascript
const moduleODataMap = {
    'General Ledger': [
        'MainAccounts', 
        'Ledgers', 
        'LedgerParameters',
        'NewEntity'  // ← Add here
    ],
    // ... other modules
};
```

### Step 3: Add Mock Data (Optional but Recommended)
Update `generateMockConfigData()` function around line 705:

```javascript
const mockData = {
    'General Ledger': {
        'MainAccounts': [...existing...],
        'NewEntity': [
            { RecId: 'NE001', Name: 'Record 1', Status: 'Active', Desc: 'First record' },
            { RecId: 'NE002', Name: 'Record 2', Status: 'Active', Desc: 'Second record' }
        ]
    },
    // ... other modules
};
```

### Step 4: Reload Extension
- Chrome: Go to `chrome://extensions/` → Click Reload
- Test extraction with the new entity

---

## Full Example: Adding Inventory Warehouse Setup

### Goal: Extract all warehouse locations for inventory management

### Step 1: Find Entity Name
Search D365F documentation: `InventWarehouseTable` or `InventLocation`

### Step 2: Edit Code
```javascript
'Inventory Management': [
    'ItemGroupTable', 
    'InventParameters', 
    'InventTable', 
    'InventItemSalesSetup', 
    'InventItemPurchSetup', 
    'InventModelGroup', 
    'InventDimGroup', 
    'InventValueReportSetup', 
    'InventTableModule', 
    'InventLocation',
    'InventLocationLogisticsEntity',
    'InventPosting', 
    'InventJournalTable', 
    'InventJournalLine', 
    'InventReportSetupDimensionFocus',
    'InventWarehouseTable'  // ← Add new entity
]
```

### Step 3: Add Mock Data
```javascript
'Inventory Management': {
    // ... existing data ...
    'InventWarehouseTable': [
        { RecId: 'WH001', Name: 'Main Warehouse', Status: 'Active', Desc: 'Primary warehouse' },
        { RecId: 'WH002', Name: 'Regional Warehouse', Status: 'Active', Desc: 'Secondary warehouse' },
        { RecId: 'WH003', Name: 'Transit Hub', Status: 'Active', Desc: 'Distribution hub' }
    ]
}
```

### Step 4: Test
1. Select "Inventory Management" module
2. Extract configuration
3. Check browser console:
   ```
   ✓ Got 3 records from InventWarehouseTable
   ```
4. Download CSV and verify records appear

---

## Advanced: Custom Entity Field Mapping

### Problem: Entity has different field names
By default, extraction looks for: `RecId`, `Name`, `Status`, `Description`

### Solution: Extend the field detection logic

Edit `extractRealConfigurationData()` around line 669:

```javascript
data.value.slice(0, 10).forEach((item, idx) => {
    // Extended field name mappings
    const recordId = item.RecId || item.EntityID || item.Key || 
                    item.dataAreaId || item.CompanyId || item.ID || 
                    item.WarehouseId || `${entity}_${idx}`;
    
    const name = item.Name || item.Description || item.DisplayName || 
                item.Title || item.DataAreaId || item.WarehouseName ||
                item.CompanyName || entity;
    
    const status = item.Status || item.Enabled || item.IsActive || 
                  item.IsInactive ? 'Inactive' : 'Active';
    
    const details = item.Description || item.Comments || item.Notes || 
                   `${entity} record`;

    records.push({
        LegalEntity: le,
        Module: module,
        Entity: entity,
        RecordID: recordId,
        Name: name,
        Status: status,
        CreatedDate: new Date().toISOString().split('T')[0],
        ModifiedDate: new Date().toISOString().split('T')[0],
        Details: details
    });
});
```

---

## Scenario: Adding Industry-Specific Modules

### Adding Banking Configuration Module

```javascript
const moduleODataMap = {
    // ... existing modules ...
    'Banking': [
        'BankLCTable',
        'BankLCImport',
        'BankLCExport',
        'BankGuaranteeTable',
        'BankAccountReconciliation',
        'BankSettlement',
        'BankReceipt',
        'BankPayment'
    ]
};
```

### Add Mock Data
```javascript
'Banking': {
    'BankLCTable': [
        { RecId: 'LC001', Name: 'Import LC #US-2025-001', Status: 'Active', Desc: 'Import LC' }
    ],
    'BankGuaranteeTable': [
        { RecId: 'BG001', Name: 'Performance Bond US-001', Status: 'Active', Desc: 'Performance guarantee' }
    ]
}
```

### Update Sidebar Options
Also update the module select dropdown in `sidebar.html`:

```html
<label><input type="checkbox" class="module-checkbox" value="Banking"> Banking</label>
```

---

## Handling Special Scenarios

### Scenario 1: Entity Has No Records
**Problem:** OData endpoint exists but returns no data  
**Solution:** Add empty check in `callODataAPI()`

Current code already handles this - continues to next pattern.

### Scenario 2: Entity Requires Special Filter
**Problem:** Need to filter by company + division  
**Solution:** Extend URL patterns

```javascript
const urlPatterns = [
    // Standard pattern
    () => `/_odata/v1/${entityName}?$top=10&$filter=DataAreaId eq '${legalEntity}'`,
    
    // With division filter
    () => `/_odata/v1/${entityName}?$top=10&$filter=DataAreaId eq '${legalEntity}' and DivisionId eq 'Finance'`,
    
    // No filter
    () => `/_odata/v1/${entityName}?$top=10`
];
```

### Scenario 3: Entity Needs Specific Field Selection
**Problem:** Entity has too many fields, OData times out  
**Solution:** Add $select parameter

```javascript
// Pattern with field selection
() => `/_odata/v1/${entityName}?$top=10&$select=RecId,Name,Description&$filter=DataAreaId eq '${legalEntity}'`
```

### Scenario 4: Large Entity Needs Pagination
**Problem:** Entity has 1000+ records  
**Solution:** Increase $top and implement multiple calls

```javascript
async function callODataAPIWithPagination(entityName, legalEntity) {
    const allRecords = [];
    let skipCount = 0;
    const pageSize = 50; // Fetch 50 records at a time
    
    while (true) {
        const url = `/_odata/v1/${entityName}?$top=${pageSize}&$skip=${skipCount}&$filter=DataAreaId eq '${legalEntity}'`;
        const data = await fetch(url).then(r => r.json());
        
        if (!data.value || data.value.length === 0) break;
        
        allRecords.push(...data.value);
        skipCount += pageSize;
        
        if (!data['@odata.nextLink']) break; // No more pages
    }
    
    return { value: allRecords };
}
```

---

## Testing Your Changes

### Test 1: Basic Entity Addition
```javascript
// In browser console:
1. Open D365 Finance page with extension
2. F12 → Console
3. Select new module
4. Run extraction
5. Check: window.D365ConfigDebug.getSidebarState().extractedRecords
6. Verify new entity records appear
```

### Test 2: Mock Data Validation
```javascript
// Verify mock data structure
window.D365ConfigDebug.getSidebarState().extractedRecords.forEach(r => {
    console.log(`${r.Module}/${r.Entity}: ${r.Name}`);
});
```

### Test 3: Export Verification
1. Extract configuration
2. Download CSV
3. Open in Excel
4. Verify:
   - Header row present
   - New entity rows included
   - All fields populated
   - No "No records extracted" message

---

## Performance Tips

### Limit Records Per Entity
Current setting: `slice(0, 10)` in line 669

To increase limit:
```javascript
data.value.slice(0, 20)  // Get 20 records instead of 10
```

**Trade-off:** More records = larger file size, slower export

### Optimize URL Patterns
Fewer patterns = faster extraction:

```javascript
const urlPatterns = [
    () => `/_odata/v1/${entityName}?$top=10&$filter=DataAreaId eq '${legalEntity}'`,
    () => `/_odata/v1/${entityName}?$top=10`
];
```

### Cache OData Results
For frequently used entities:

```javascript
const oDataCache = {};

async function cachedODataCall(entity, le) {
    const key = `${entity}_${le}`;
    if (oDataCache[key]) return oDataCache[key];
    
    const result = await callODataAPI(entity, le);
    oDataCache[key] = result;
    return result;
}
```

---

## Troubleshooting

### Issue: Entity Not Found
**Error:** `404 not found`  
**Check:**
- Entity name spelling (case-sensitive!)
- OData enabled in D365F
- Entity is in public APIs (not internal)

**Fix:** Try without filter first:
```javascript
/_odata/v1/EntityName?$top=10
```

### Issue: No Permission
**Error:** `403 Forbidden`  
**Check:**
- User has security role for OData access
- Entity is not restricted by security role
- User has read permission on entity

**Fix:** Add to URL patterns without filter:
```javascript
() => `/_odata/v1/${entityName}?$top=5`  // Fewer records might bypass some checks
```

### Issue: Timeout
**Error:** Extraction hangs  
**Check:**
- Entity has too many records
- OData endpoint is slow
- Network connectivity

**Fix:** Reduce $top or add timeout:
```javascript
const response = await fetch(url, {
    headers: {...},
    timeout: 3000  // 3-second timeout
});
```

---

## Best Practices

✅ **DO:**
- Add mock data alongside OData entities
- Test with small record counts first
- Add meaningful entity descriptions
- Document custom entities in this file
- Use uppercase entity names

❌ **DON'T:**
- Remove existing entities without testing
- Add 100+ entities (causes slow extraction)
- Use entity names that don't exist in your D365 version
- Hardcode company codes (use selectedLE)
- Forget to reload extension after changes

---

## Common Entity Names Reference

| Module | Common Entities |
|--------|-----------------|
| GL | MainAccounts, Ledgers, DimensionAttribute |
| AR | CustTable, CustGroup, CustPostingProfiles |
| AP | VendTable, VendGroup, VendPostingProfiles |
| Inventory | InventTable, ItemGroupTable, InventLocation |
| Projects | ProjTable, ProjCategory, ProjPostingProfile |
| Manufacturing | ProdTable, ProdBOM, RouteTable |
| FA | AssetTable, AssetGroup, AssetDepreciationProfile |
| HR | HcmWorker, HcmPosition, HcmJob |
| Sales | SalesTable, CustTable, SalesQuotationTable |
| Purchasing | PurchTable, VendTable, PurchReqTable |

---

## Submitting New Entity Suggestions

Found a useful entity? Help improve the tool:

1. **Entity Name:** MainAccountsForReporting
2. **Module:** General Ledger
3. **Use Case:** Consolidation reporting
4. **Sample Records:** 5-10 account records per LE
5. **Source:** D365F OData documentation link

Please create an issue or submit a PR with:
- Entity name additions
- Updated mock data
- Test results
- Documentation updates

---

## Related Files

- `src/sidebar/sidebar.js` - Main extraction logic
- `ENTITIES_REFERENCE.md` - Complete entity list
- `EXTRACTION_FIX_SUMMARY.md` - How extraction works
- `QUICK_START_FIX_TEST.md` - Testing guide
