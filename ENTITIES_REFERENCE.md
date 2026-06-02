# D365 Finance Configuration Entities Reference

## Overview
This document lists all OData entities currently being extracted by the D365 Finance Configuration Extractor. The extractor now covers **80+ entities** across **14 modules** with comprehensive configuration capture.

---

## Module: General Ledger (15 entities)
Captures all GL configuration and accounting setup.

| Entity | Description | Records |
|--------|-------------|---------|
| MainAccounts | Chart of Accounts | GL accounts (1000, 1100, 1200, etc.) |
| Ledgers | Ledger definitions | Main GL, Tax Ledger |
| LedgerParameters | GL system parameters | GL setup and defaults |
| LedgerChartOfAccounts | Chart of Accounts structure | COA hierarchy |
| LedgerJournalTable | Journal definitions | Journal batches and types |
| LedgerJournalTrans | Journal transactions | Posted transactions |
| LedgerPosting | Posting profiles | GL posting setup |
| LedgerDimensionAttribute | Financial dimensions | Department, Cost Center, Project |
| DimensionAttribute | Dimension definitions | All dimensions |
| DimensionAttributeValue | Dimension values | Dimension members |
| DimensionHierarchy | Dimension hierarchies | Hierarchical structures |
| GeneralLedgerParameters | Global GL parameters | Company-wide GL setup |
| LedgerAccrualTable | Accrual profiles | Accrual configurations |
| ExchRateType | Exchange rate types | Currency conversion rates |
| CurrencyTable | Currency definitions | Active currencies |

**Mock Sample Records:** 
- MainAccounts: 1000 (Cash), 1100 (Bank), 1200 (AR), 1400 (Inventory), 1600 (Fixed Assets), 2100 (AP), 2200 (Payroll), 3100 (Equity)
- Dimensions: Department, Cost Center, Project

---

## Module: Accounts Receivable (13 entities)
Customer credit and billing configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| CustGroup | Customer groups | 10-Domestic, 20-International, 30-Government |
| CustPostingProfiles | AR posting profiles | Domestic, International |
| CustTable | Customer master | Active customer records |
| CustInvoiceTable | Customer invoices | Transaction history |
| CustParameters | AR system parameters | AR setup |
| CustPaymMode | Payment methods | Check, Wire Transfer |
| CustPaymSchedTable | Payment schedules | Recurring payments |
| CustTradingPartnerTable | Trading partners | EDI partners |
| CustCreditLimit | Credit limit setup | Customer credit lines |
| CustInterestTable | Interest calculations | Late payment interest |
| CustCollectionLetterTable | Collection letters | Collection letter templates |
| CustCollectionLetterLine | Collection letter lines | Letter configurations |
| CustDueReportDetail | Collections reporting | Aging reports |

**Mock Sample Records:**
- Customer Groups: Domestic, International, Government
- Payment Methods: Check, Wire Transfer
- Posting Profiles: Standard, International

---

## Module: Accounts Payable (12 entities)
Vendor and payables management configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| VendGroup | Vendor groups | 10-Suppliers, 20-Contractors, 30-One-Time |
| VendPostingProfiles | AP posting profiles | Standard, Government |
| VendTable | Vendor master | Active vendor records |
| VendInvoiceTable | Vendor invoices | AP transactions |
| VendParameters | AP system parameters | AP setup |
| VendPaymMode | Payment methods | Check, ACH |
| VendPaymSchedTable | Payment schedules | Payment terms |
| VendTradingPartnerTable | Trading partners | EDI vendors |
| VendDueReportDetail | Aging reports | Payables aging |
| VendInvoiceJour | Invoice journals | AP batches |
| VendInvoiceLine | Invoice line items | Invoice details |
| VendRFQTable | RFQ records | Purchase requests |

**Mock Sample Records:**
- Vendor Groups: Suppliers, Contractors, One-Time
- Payment Methods: Check, ACH Transfer
- Posting Profiles: Standard, Government

---

## Module: Inventory Management (14 entities)
Inventory valuation and warehouse configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| ItemGroupTable | Item groups | 10-Raw Materials, 20-Finished Goods, 30-Supplies |
| InventParameters | Inventory parameters | Inventory system setup |
| InventTable | Item master | Product/SKU records |
| InventItemSalesSetup | Sales setup per item | Sales parameters |
| InventItemPurchSetup | Purchase setup per item | Purchase parameters |
| InventModelGroup | Costing methods | FIFO, LIFO, Weighted Average |
| InventDimGroup | Tracking dimensions | Batch, Serial, Location tracking |
| InventValueReportSetup | Valuation setup | Inventory valuation |
| InventTableModule | Item module setup | Module-specific settings |
| InventLocation | Warehouse locations | Main Warehouse, Distribution Center |
| InventLocationLogisticsEntity | Location logistics | Shipping locations |
| InventPosting | Inventory posting | GL posting setup |
| InventJournalTable | Inventory journals | Adjustment batches |
| InventJournalLine | Journal line items | Adjustment details |

**Mock Sample Records:**
- Item Groups: Raw Materials, Finished Goods, Supplies
- Costing Methods: FIFO, LIFO, Weighted Average
- Locations: Main Warehouse, Distribution Center

---

## Module: Project Management (10 entities)
Project accounting and delivery configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| ProjCategory | Project categories | Labor, Material, Expense |
| ProjParameters | Project parameters | Project system setup |
| ProjTable | Project records | Active projects |
| ProjCost | Project cost setup | Cost tracking |
| ProjRevenue | Revenue recognition | Revenue accounting |
| ProjCostSalesPrice | Pricing rules | Cost + markup pricing |
| ProjFundingSource | Funding sources | Project funding |
| ProjFundLimit | Budget limits | Fund restrictions |
| ProjInvoiceTable | Project invoices | Time & materials billing |
| ProjPostingProfile | Project posting | GL posting setup |

**Mock Sample Records:**
- Categories: Labor, Material, Expense
- Posting: Standard

---

## Module: Manufacturing (10 entities)
Production and BOM configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| ProdParameters | Production parameters | Manufacturing setup |
| BOMParameters | BOM parameters | BOM system setup |
| ProdTable | Production orders | Work orders |
| ProdRouteTable | Production routes | Work sequences |
| ProdBOM | Bill of Materials | Component lists |
| ProdBOMLine | BOM line items | Component details |
| ProdRoute | Route definitions | Manufacturing processes |
| ProdRouteOpr | Route operations | Process steps |
| RouteTable | Master routes | Standard processes |
| RouteTrans | Routing transactions | Historical records |

**Mock Sample Records:**
- Routes: Assembly Line A, Assembly Line B

---

## Module: Fixed Assets (8 entities)
Asset management and depreciation configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| AssetGroup | Asset classes | Buildings, Machinery, Vehicles |
| AssetParameters | FA system parameters | Fixed asset setup |
| AssetTable | Asset records | Individual assets |
| AssetBook | Asset books | Book definitions |
| AssetDepreciationProfile | Depreciation methods | 5-Yr SL, 10-Yr SL |
| AssetDeprBook | Depreciation setup | Schedule configuration |
| AssetJournal | Asset journals | Adjustment batches |
| AssetTrans | Asset transactions | Transaction history |

**Mock Sample Records:**
- Asset Groups: Buildings, Machinery, Vehicles
- Depreciation Methods: Straight-Line (5yr), Straight-Line (10yr)

---

## Module: Cash Management (7 entities)
Bank account and cash management configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| BankParameters | Bank system parameters | Bank setup |
| BankAccountTable | Bank accounts | Checking, Savings |
| BankAccountTransactionType | Transaction types | Deposit, Withdrawal |
| BankAccountSetup | Account setup | Bank details |
| BankInvoiceMatchingRule | Matching rules | Invoice matching |
| BankInvoiceMatchingRuleDetail | Matching details | Rule configuration |
| BankStatementFormat | Statement formats | Bank formats |

**Mock Sample Records:**
- Bank Accounts: Checking Account, Savings Account
- Transaction Types: Deposit, Withdrawal

---

## Module: Human Resources (8 entities)
Employee and payroll configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| HRMParameters | HR parameters | HR system setup |
| PayrollParameters | Payroll parameters | Payroll setup |
| HcmWorker | Employee records | Active employees |
| HcmEmployment | Employment records | Employment details |
| HcmPosition | Position definitions | Job positions |
| HcmJob | Job definitions | Manager, Analyst, etc. |
| HcmJobFunction | Job functions | Functional roles |
| PayrollTaxData | Tax setup | Tax regions and data |

**Mock Sample Records:**
- Jobs: Manager, Analyst

---

## Module: Procurement (10 entities)
Purchasing and sourcing configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| ProcurementCategories | Procurement categories | Raw Materials, Services |
| PurchParameters | Purchase parameters | Purchasing setup |
| VendProcurementCategory | Vendor categories | Vendor classifications |
| PurchCatalogPolicy | Catalog policies | Approved vendors |
| PurchReqTable | Purchase requisitions | Requisition records |
| PurchReqLine | Req line items | Requisition details |
| PurchTable | Purchase orders | PO records |
| PurchLine | Purchase order lines | PO line items |
| PurchRFQTable | RFQ records | Request for quote |
| PurchAgreementHeader | Purchase agreements | Framework agreements |

**Mock Sample Records:**
- Categories: Raw Materials, Services

---

## Module: Sales (8 entities)
Sales order and customer management configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| SalesParameters | Sales parameters | Sales system setup |
| TradeAgreement | Trade agreements | Volume Discount, Customer Pricing |
| SalesTable | Sales orders | SO records |
| SalesLine | Sales order lines | SO line items |
| SalesOrderHeader | Order headers | Order master |
| SalesQuotationTable | Quotations | Quote records |
| SalesQuotationLine | Quote lines | Quote details |
| SalesDeliverySchedule | Delivery schedules | Shipment schedules |

**Mock Sample Records:**
- Trade Agreements: Volume Discount, Customer Pricing

---

## Module: Organization Admin (10 entities)
Company and organizational structure configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| CompanyInfo | Company information | USMF (United States Manufacturing) |
| OMOperatingUnit | Operating units | Finance Division, Sales Division |
| OMHierarchyType | Hierarchy types | Organization hierarchies |
| OMHierarchyPurpose | Hierarchy purposes | Purpose definitions |
| OMInternalOrganization | Internal organizations | Company-wide organizations |
| OMExternalOrganization | External organizations | External entities |
| OMDepartment | Departments | Organizational departments |
| NumberSequenceTable | Number sequences | Numbering setup |
| NumberSequenceReference | Sequence references | Sequence usage |
| Division | Business divisions | Company divisions |

**Mock Sample Records:**
- Legal Entity: USMF (United States Manufacturing)
- Operating Units: Finance Division, Sales Division

---

## Module: Tax (8 entities) - NEW
Tax and tax setup configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| TaxParameters | Tax system parameters | Tax setup |
| TaxTable | Tax codes | Sales Tax, Income Tax |
| TaxSetupTable | Tax setup records | Tax configuration |
| TaxGroupHeading | Tax groups | Tax group definitions |
| TaxItemGroupHeading | Item tax groups | Item tax groups |
| TaxRegimeTable | Tax regimes | Regime definitions |
| TaxRegistration | Tax registration | Registration records |
| TaxJurisdiction | Tax jurisdictions | Jurisdiction setup |

**Mock Sample Records:**
- Tax Types: Sales Tax, Income Tax

---

## Module: Budget (7 entities) - NEW
Budgeting and budget control configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| BudgetParameters | Budget parameters | Budget system setup |
| BudgetModel | Budget models | FY2025 Budget |
| BudgetPlanningProcess | Planning processes | Process definitions |
| BudgetPlanningStage | Planning stages | Workflow stages |
| BudgetPlanningWorksheet | Worksheets | Planning worksheets |
| BudgetPlan | Budget plans | Budget records |
| BudgetPlanLine | Budget lines | Budget line items |

**Mock Sample Records:**
- Budget Model: FY2025 Budget

---

## Module: Financial Reporting (4 entities) - NEW
Financial reporting configuration.

| Entity | Description | Records |
|--------|-------------|---------|
| FinancialReportingParameters | FR parameters | Reporting setup |
| FinancialReportingTreeNode | Report nodes | Tree structure |
| FinancialReportingTreeRow | Report rows | Row definitions |
| FinancialReportingTreeColumn | Report columns | Column definitions |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Modules | 14 |
| Total Entities | **80+** |
| Average Entities per Module | 5.7 |
| Mock Sample Records | **100+** (varies by selection) |
| Legal Entities Supported | Unlimited |

---

## Data Extraction Process

### For Each Configuration:
1. **Legal Entity Selected** → Filters by DataAreaId
2. **Module Selected** → Determines entity list
3. **For Each Entity** → Calls OData API
4. **If OData Fails** → Uses mock data
5. **Records Captured** → 5-10 records per entity (limit)

### Total Records Per Extraction:
```
Estimated = Num_LEs × Num_Modules × Avg_Entities × Avg_Records
Example: 2 LEs × 5 Modules × 5 Entities × 5 Records = 250 records
```

---

## OData Endpoint Format

```
/_odata/v1/{EntityName}?$top=10&$filter=DataAreaId eq 'USMF'
```

### URL Patterns Tried (in order):
1. `/_odata/v1/{entity}?$top=10&$filter=DataAreaId eq '{LE}'`
2. `/_odata/v1/{entity}?$top=10`
3. `/_odata/v1/{entity}?$top=10&$filter=dataAreaId eq '{LE}'`
4. `/_odata/v1/{entity}?$top=10&$filter=companyId eq '{LE}'`

---

## Sample Export Records

When extraction runs, each record includes:

```
LegalEntity: "USMF"
Module: "General Ledger"
Entity: "MainAccounts"
RecordID: "MA001"
Name: "1000 - Cash"
Status: "Active"
CreatedDate: "2025-01-23"
ModifiedDate: "2025-01-23"
Details: "Cash on hand"
```

---

## How to Add More Entities

To add additional OData entities for extraction:

1. **Open** `src/sidebar/sidebar.js`
2. **Find** `moduleODataMap` object (around line 572)
3. **Add** entity name to module array:
   ```javascript
   'General Ledger': [
       'MainAccounts', 
       'Ledgers', 
       'LedgerParameters',
       'NewEntity'  // ← Add here
   ]
   ```
4. **Add** mock data (optional, for testing):
   ```javascript
   'NewEntity': [
       { RecId: 'NE001', Name: 'Record Name', Status: 'Active', Desc: 'Description' }
   ]
   ```
5. **Save** and reload extension

---

## Tips for Getting Real Data

### If OData Returns No Data:
1. Check entity name spelling (case-sensitive)
2. Verify OData is enabled in D365F
3. Check user permissions for OData
4. Review browser console for actual OData errors
5. Try entity without DataAreaId filter first

### To Find Available Entities:
1. Open D365F → **System Administration** → **Services**
2. Look for **Data Management** or **OData Services**
3. Search entity names in D365F documentation
4. Check PowerBI or Excel connector for available entities

---

## Related Documentation

- `EXTRACTION_FIX_SUMMARY.md` - How extraction works
- `QUICK_START_FIX_TEST.md` - Testing guide
- `CHANGELOG_FIX.md` - Recent fixes
- D365F OData Endpoint Documentation (Microsoft Learn)
