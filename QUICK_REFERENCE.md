# Quick Reference: Configuration Master Data Entities

## Most Frequently Extracted Entities

### Tax Configuration (Primary Use Case)
✅ **Always extracted in Tax module:**
- SalesTaxCodes
- SalesTaxGroups
- ItemSalesTaxGroups
- TaxExemptCodes
- WithholdingTaxCodes
- WithholdingTaxGroups
- TaxParameters
- TaxAuthorities
- **New:** TaxComponentsTable, TaxJurisdictions, TaxIntervals

### Payment Schedule & Terms
✅ **Always extracted in AR/AP modules:**
- CustomerPaymentSchedules / VendorPaymentSchedules
- CustomerPaymentScheduleLines / VendorPaymentScheduleLines
- PaymentTerms
- PaymentDays / PaymentDayLines
- CashDiscounts
- CustomerPaymentMethods / VendorPaymentMethods

### Posting Profiles (Critical for AR/AP/Inventory)
✅ **Module-specific:**
- AR: CustomerPostingProfiles, CustomerPostingProfileLines
- AP: VendorPostingProfiles, VendorPostingProfileLines
- Inventory: InventPostingProfiles, InventInventoryProfileCustomerVendorLedgerEntity
- Fixed Assets: FixedAssetPostingProfiles, FixedAssetPostingProfileLines, AssetPostingProfileEntity, AssetPostingProfileDisposalEntity
- Projects: ProjectPostingProfiles, ProjPostingProfileLines, ProjLedgerPostingDefinitionEntity

### Ledger & Chart of Accounts
✅ **GL Module:**
- MainAccounts (all GL accounts)
- MainAccountCategories
- LedgerChartOfAccounts
- DimensionAttributes (financial dimensions)
- DimensionHierarchies
- LedgerParameters / GeneralLedgerParameters

### Bank & Cash Management
✅ **Bank Module:**
- BankAccounts
- BankParameters
- BankStatementFormats
- BankChequeLayouts
- BankReconciliationMatchRules

### Vendor & Customer Groups
✅ **AR/AP Modules:**
- CustomerGroups / VendorGroups
- CustomerPostingProfiles / VendorPostingProfiles
- CustomerCharges / VendorCharges
- VendorCategories
- TradeAgreementJournalNames

### Inventory Setup
✅ **Inventory Module:**
- ItemGroups
- InventoryModelGroups (FIFO, LIFO, Average cost)
- InventoryDimensionGroups
- Warehouses
- InventoryPostingSetup

### Organization & Administration
✅ **Org Admin Module:**
- CompanyInfo (legal entity master)
- OperatingUnits
- Departments / Divisions / Teams
- NumberSequenceGroups
- OrganizationHierarchyTypes

## Entity Count by Module

| Module | Entities | Primary Use |
|--------|----------|-------------|
| General Ledger | 59 | Chart of accounts, dimensions, intercompany |
| Accounts Receivable | 53 | AR posting profiles, payment terms, customer groups |
| Accounts Payable | 52 | AP posting profiles, payment terms, vendor groups |
| Cash & Bank Management | 40 | Bank accounts, reconciliation, cheques |
| Fixed Assets | 42 | Asset groups, depreciation, posting profiles |
| Tax | 23 | Tax codes, groups, authorities, jurisdictions |
| Consolidation | 24 | Consolidation setup, elimination rules |
| Project Management | 17 | Project groups, categories, billing |
| Human Resources | 18 | HR setup, benefits, compensation |
| Inventory Management | 27 | Item groups, warehouse, posting setup |
| Cost Accounting | 16 | Cost centers, allocation, rates |
| Manufacturing | 14 | Production, BOM, route setup |
| Procurement | 16 | Sourcing, RFQ/requisition, category governance |
| Sales | 18 | Sales pools, statistics, commissions |
| Organization Admin | 16 | Company, departments, number sequences |
| Budget | 14 | Budget models, control rules, planning |

**Total configured extraction list: 449 entities across 16 modules**

## How to Extract Specific Entities

### Option 1: Select Entire Module
1. Open the extension sidebar
2. Check the desired module (e.g., "Tax")
3. Click "Extract Configuration"
4. All entities in that module are extracted

### Option 2: Select Multiple Modules
1. Check multiple module checkboxes
2. Use "All" button to select all modules
3. Use "Core" button for essential modules (GL, AR, AP, Cash & Bank, Fixed Assets)
4. Click "Extract Configuration"

### Option 3: Extraction Tips
- **First extraction:** Use "Core" modules for faster results
- **Large environments:** Extract 10-20 legal entities at a time
- **Comparison:** Enable "Include Comparison" to see differences across LEs
- **Export format:** Use Excel for analysis, JSON for system import

## Common Extraction Scenarios

### Scenario 1: Tax Code Extraction
**Goal:** Compare tax codes across all legal entities
1. Select all legal entities (or use "Select All")
2. Select "Tax" module only
3. Enable "Include Comparison"
4. Format: Excel
5. Time: ~5 minutes for 50 LEs

### Scenario 2: Posting Profile Audit
**Goal:** Find inconsistent posting profiles
1. Select all legal entities
2. Select "Accounts Receivable" + "Accounts Payable" + "Inventory Management"
3. Enable "Include Comparison"
4. Format: Excel
5. Time: ~10-15 minutes for 50 LEs

### Scenario 3: Payment Terms & Schedules
**Goal:** Document all payment terms and schedules
1. Select all legal entities
2. Select "Accounts Receivable" + "Accounts Payable"
3. Disable "Include Comparison" if just data extraction needed
4. Format: Excel or CSV
5. Time: ~5-10 minutes for 50 LEs

### Scenario 4: Full Configuration Backup
**Goal:** Extract all configuration setup
1. Select all legal entities
2. Click "All" to select all modules
3. Enable "Include Comparison"
4. Format: JSON (for system import)
5. Time: ~30-45 minutes for 50 LEs

## Entity Categories by Business Need

### For Finance Team
- Chart of Accounts (MainAccounts, LedgerChartOfAccounts)
- Ledger Parameters
- Financial Dimensions (DimensionAttributes, Hierarchies)
- Posting Profiles (GL-related)
- Tax Setup
- Currencies & Exchange Rates

### For AR Team
- Customer Groups
- Customer Posting Profiles
- Payment Methods & Schedules
- Payment Terms
- Cash Discounts
- Collections Setup

### For AP Team
- Vendor Groups
- Vendor Posting Profiles
- Payment Methods & Schedules
- Payment Terms
- Vendor Categories
- Invoice Matching Policies

### For Inventory Team
- Item Groups
- Warehouse Setup
- Inventory Model Groups
- Posting Profiles (Inventory)
- Dimension Groups

### For Compliance
- Tax Codes & Groups
- Tax Authorities & Jurisdictions
- Withholding Tax Setup
- All Posting Profiles
- Number Sequences
- Bank Setup

## Export Formats

### Excel (.xlsx)
**Best for:** Analysis, sharing, comparison
- Formatted sheets per entity
- Color-coded comparison results
- Pivot table friendly
- Formula-ready for calculations
- Summary sheet includes skipped entities list
- Summary sheet includes ready-to-use Excel Copilot reconciliation prompt
- Skipped entities now show clearer reason categories (endpoint missing, endpoint empty, endpoint call failed)

### CSV (.csv)
**Best for:** System import, data migration
- One file per entity
- Comma-separated values
- Import into other systems
- Excel-compatible
- Includes skipped entities section and Copilot reconciliation prompt section

### JSON (.json)
**Best for:** System integration, API import
- Structured data format
- Programmatic access
- API endpoints
- Version control friendly
- Summary block includes skipped entities and Copilot reconciliation prompt

### Text (.txt)
**Best for:** Quick review, documentation
- Plain text format
- Human-readable
- Email-friendly
- No special software needed
- Includes skipped entities section and Copilot reconciliation prompt section

## Performance Notes

- **Extraction time:** 5-45 minutes depending on entity count and LE count
- **Optimal batch size:** 50-100 legal entities per extraction
- **Network:** Requires stable internet connection throughout extraction
- **Browser:** Chrome or Edge recommended
- **Memory:** Works efficiently with 1GB+ available RAM

## Endpoint Validation Notes

- Configured entities are validated against the live OData service document (`/data`) during extraction.
- Common endpoint name variants are auto-tried when exact names are not found.
- If an endpoint does not exist in the environment, it is reported explicitly in skipped entities.
