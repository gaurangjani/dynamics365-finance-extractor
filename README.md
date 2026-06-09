# D365 Finance Configuration Extractor

A powerful Chrome/Edge browser extension for extracting and comparing Dynamics 365 Finance configuration data across multiple legal entities with multi-format export support.

## 🎯 Features

- **Multi-Legal Entity Support**: Extract configuration from 100+ legal entities simultaneously
- **Multiple Export Formats**: Excel (.xlsx), CSV (.csv), JSON (.json), and Text (.txt)
- **Selectable Output Content**: Choose Data only, Comparison only, or both before export
- **Audit-Friendly Summary Output**: Includes skipped entity list and extraction call stats
- **Excel Copilot Reconciliation Prompt**: Auto-generated, ready-to-use prompt embedded in export summaries
- **Configuration Comparison**: Automatically identify differences between legal entity configurations
- **Session-Based Authentication**: Works with your current D365F session (no additional credentials needed)
- **Performance Optimized**: Handles large-scale extractions efficiently using IndexedDB
- **Real-Time Progress Tracking**: Monitor extraction progress with detailed status updates

## 📦 What Gets Extracted

The extension extracts configuration-focused master/setup data across 16 D365F modules:

### Core Configuration Entities:

**General Ledger (59 entities):**
- Chart of Accounts (Main Accounts, Categories, Hierarchies)
- Ledgers & Ledger Parameters
- Financial Dimensions (Attributes, Hierarchies, Sets)
- Allocation Rules & Bases
- Fiscal Calendars & Accounting Periods
- Currencies & Exchange Rate Types
- Posting Setup & Account Structures
- Intercompany & Settlement Setup

**Accounts Receivable (53 entities):**
- Customer Groups & Posting Profiles
- Payment Methods & Payment Schedules
- Cash Discounts & Payment Terms
- Collections & Interest Setup
- Trade Agreements & Statistics
- Charges Setup

**Accounts Payable (52 entities):**
- Vendor Groups & Posting Profiles
- Payment Methods & Payment Schedules
- Invoice Matching Policies
- Charges & Vendor Categories
- Purchase Policies & Procurement Categories

**Cash & Bank Management (40 entities):**
- Bank Accounts & Types
- Bank Statement Formats
- Reconciliation & Invoice Matching Rules
- Cheque Layouts & Negative Payment Formats
- Cash Flow Forecast Setup

**Fixed Assets (42 entities):**
- Asset Groups & Parameters
- Books & Depreciation Profiles
- Posting Profiles & Insurance Types
- Component & Classification Setup

**Tax (23 entities):**
- Sales Tax Codes & Groups
- Tax Parameters & Authorities
- Withholding Tax Setup
- Tax Exempt Codes & Groups
- Tax Components & Mapping
- Tax Intervals & Jurisdictions
- Tax Reporting & Intrastat Setup
- Tax Transaction Code Mapping

**Inventory Management (27 entities):**
- Item Groups & Model Groups
- Warehouse Setup
- Posting Profiles
- Quality Setup

**Project Management (17 entities):**
- Project Parameters & Groups
- Categories & Posting Profiles
- Resource & Billing Setup

### Additional Module Coverage:

- Consolidation (24 entities)
- Manufacturing (14 entities)
- Human Resources (18 entities)
- Procurement (16 entities)
- Sales (18 entities)
- Organization Admin (16 entities)
- Budget (14 entities)
- Cost Accounting (16 entities)

## 📋 Complete Entity Reference

### Configuration Master Data Entities by Category

**Tax & Duty Management:**
- SalesTaxCodes
- SalesTaxGroups
- ItemSalesTaxGroups
- TaxExemptCodes
- TaxExemptCodeGroupHeaders
- TaxExemptCodeGroupMembers
- TaxAuthorities
- TaxParameters
- TaxSettlementPeriods
- TaxRegistrationTypes
- WithholdingTaxCodes
- WithholdingTaxGroups
- TaxComponentsTable
- TaxTable
- TaxIntrastatCommodityCodes
- TaxJurisdictions
- TaxJurisdictionGroups
- TaxTransactionCodeMapping
- TaxReportingCodes
- TaxFreeAccounts

**Payment Setup:**
- CustomerPaymentMethods
- CustomerPaymentMethodSpecifications
- CustomerPaymentSchedules
- CustomerPaymentScheduleLines
- VendorPaymentMethods
- VendorPaymentMethodSpecifications
- VendorPaymentSchedules
- VendorPaymentScheduleLines
- PaymentTerms
- PaymentDays
- PaymentDayLines
- CashDiscounts

**Posting Profiles:**
- CustomerPostingProfiles
- CustomerPostingProfileLines
- VendorPostingProfiles
- VendorPostingProfileLines
- FixedAssetPostingProfiles
- FixedAssetPostingProfileLines
- InventPostingProfiles
- InventInventoryProfileCustomerVendorLedgerEntity
- ProjectPostingProfiles
- ProjPostingProfileLines
- ProjLedgerPostingDefinitionEntity

**Master Data Setup:**
- Currencies
- ExchangeRateTypes
- NumberSequenceCodes
- NumberSequenceReferences
- NumberSequenceGroupReferences
- LedgerParameters
- GeneralLedgerParameters
- Departments
- Divisions
- Teams
- OperatingUnits

**Ledger & Accounts:**
- MainAccounts
- MainAccountCategories
- LedgerChartOfAccounts
- MainAccountLegalEntityOverrides
- MainAccountConsolidateAccounts
- LedgerConsolidateAccountGroups
- DimensionAttributes
- DimensionHierarchies
- DimensionHierarchyNodes
- DimensionSets
- DimensionSetLines
- LedgerExchAdjPostingEntity
- LedgerPostingJournalEntity
- JournalizingTransactionPostingDefinitionEntity

**Banks & Cash Management:**
- BankAccounts
- BankAccountTypes
- BankAccountTransactionTypes
- BankParameters
- BankStatementFormats
- BankChequeLayouts
- BankReconciliationMatchRules
- CashFlowForecastAccounts

**Vendors & Customers:**
- CustomerGroups
- VendorGroups
- VendorCategories
- VendorCertificateTypes
- CustomerCharges
- VendorCharges
- TradeAgreementJournalNames
- SalesAgreementClassifications

**Inventory & Warehouse:**
- ItemGroups
- InventoryParameters
- InventoryModelGroups
- InventoryDimensionGroups
- Warehouses
- InventoryPostingSetup
- InventTestGroups
- InventQualityGroups
- InventLedgerPostingDefinitionCombinationEntity
- InventInventoryLedgerPostingDefinitionEntity
- InventProcurementLedgerPostingDefinitionEntity
- InventProductionLedgerPostingDefinitionEntity
- InventSalesLedgerPostingDefinitionEntity
- InventStandardCostVarianceLedgerPostingDefinitionEntity

**Projects & Assets:**
- ProjectParameters
- ProjectGroups
- ProjectCategories
- ProjectPostingProfiles
- FixedAssetGroups
- FixedAssetParameters
- FixedAssetBooks
- FixedAssetDepreciationProfiles

**Organization & Admin:**
- CompanyInfo
- LedgerIntercompanyAccounts
- LedgerIntercompanyPosting
- ReasonCodes
- FiscalCalendars
- FiscalCalendarPeriods
- OrganizationHierarchyTypes
- BudgetParameters
- BudgetModels
- BudgetControlConfiguration

## 🚀 Installation

### For Development:

1. Clone this repository:
```bash
git clone <repo-url>
cd Dynamics365Finance
```

2. Open Chrome or Edge browser

3. Navigate to `chrome://extensions/` (or `edge://extensions/`)

4. Enable **Developer Mode** (toggle in top-right corner)

5. Click **Load unpacked** and select the project root directory

6. The extension icon will appear in your toolbar

### For Production:

The extension can be packaged and distributed through:
- Chrome Web Store
- Microsoft Edge Add-ons Store
- Internal enterprise deployment via Group Policy

## 💻 Usage

### Basic Workflow:

1. **Navigate to Dynamics 365 Finance** and ensure you're logged in

2. **Open the Extension** by clicking its icon in the toolbar

3. **Select Configuration**:
   - Choose legal entities (or use "Select All")
   - Choose D365F modules to extract
   - Select export format (Excel, CSV, JSON, Text)
   - Choose output content:
     - Include Data
     - Include Comparison

4. **Start Extraction**:
   - Click "Extract Configuration"
   - Monitor progress in real-time
   - Estimated time: 5-15 minutes for 100+ legal entities

5. **Export Results**:
   - Results appear as downloadable files
   - Click "Download" next to each file
   - Files saved to your Downloads folder

### Comparison Features:

The extension automatically generates a **Comparison Report** that includes:

- **Summary**: Overview of all legal entities compared
- **Missing Entities**: Which legal entities lack certain configurations
- **Detailed Differences**: Record-level differences across legal entities
- **Match Status**: Configuration parity between legal entities

### Excel Integration:

Open the generated `.xlsx` file in Excel to:
- Use **Excel Copilot** to analyze differences
- Create pivot tables for quick insights
- Filter and sort configuration data
- Share analysis with stakeholders

## 🏗️ Project Structure

```
dynamics365-finance-extractor/
├── manifest.json              # Extension configuration
├── package.json
├── README.md
├── src/
│   ├── background/
│   │   └── background.js
│   ├── content/
│   │   └── content.js
│   ├── lib/
│   │   └── xlsx.full.min.js
│   ├── popup/
│   │   ├── toggle.html
│   │   └── toggle.js
│   ├── sidebar/
│   │   ├── sidebar.css
│   │   ├── sidebar.html
│   │   └── sidebar.js
│   └── utils/
│       └── exporters.js
├── icons/
│   └── ...
```

## 🔧 Architecture

### Component Overview:

Popup (toggle.html/js)
- Opens/closes the injected sidebar on the active D365F tab

Sidebar (sidebar.html/js)
- Primary extraction UI and workflow
- Legal entity/module selection
- Output selection (Include Data / Include Comparison)
- Direct multi-format export generation

Content Script (content.js)
- Runs in D365F page context
- Injects and toggles sidebar UI

Background Service Worker (background.js)
- Manages extraction sessions
- Coordinates multi-LE extraction
- Manages file downloads
- Uses IndexedDB for large datasets

Utilities (utils/exporters.js)
- Export helper scaffolding for format-specific output handling

### Data Flow:

```
User selects entities
         ↓
Popup sends message to Content Script
         ↓
Content Script injects sidebar and starts extraction workflow
         ↓
Sidebar fetches data from D365 OData endpoints
         ↓
Comparison and export generation in sidebar workflow
         ↓
Files available for download
```

## 📊 Comparison Report Structure

The generated comparison report includes:

### Summary Section:
```
Legal Entities: USPM, USMF, JPMF
Total Entities: 8
Total Records: 2,450
Missing Entities by LE:
  USPM: None
  USMF: TaxGroups
  JPMF: NumberSequences
```

### Entity Comparisons:
```
[MainAccounts]
  USPM ↔ USMF
    LE1 Records: 145
    LE2 Records: 142
    Difference: 3
    Status: DIFFERENCE ✗

  USPM ↔ JPMF
    LE1 Records: 145
    LE2 Records: 145
    Difference: 0
    Status: MATCH ✓
```

### Detailed Differences:
```
Records with Modifications: 5
Records Added (in some LEs): 8
Records Removed (from some LEs): 3
Unchanged Records: 134
```

## ⚙️ Configuration

### Adjusting Performance:

For very large deployments (200+ legal entities), adjust extraction scope:

```javascript
// Narrow extraction by module first (recommended)
// Example: run Tax only, then AR/AP in separate runs
```

### Custom Entity Selection:

To add additional entities, edit `src/sidebar/sidebar.js` in `moduleODataMap`:

```javascript
'Tax': [
   'TaxParameters',
   'SalesTaxCodes',
   'YourNewEntity' // Add new OData entity here
]
```

## 🔐 Security & Privacy

- **No Credentials Stored**: Uses your existing D365F session (cookie-based)
- **Local Storage Only**: All data stored locally in your browser
- **No External APIs**: All data remains within your organization
- **HTTPS Only**: Extension only works on secure HTTPS connections
- **No Data Transmission**: Data never leaves your device

## 🐛 Troubleshooting

### Extension not showing legal entities:
1. Ensure you're logged into D365F
2. Check browser console (F12) for errors
3. Verify host permissions in manifest.json
4. Try refreshing the page

### Extraction timeout (100+ LEs):
1. Close other browser tabs
2. Run modules in smaller batches (for example: Tax first, then AR/AP)
3. Try extracting fewer legal entities at once
4. Check network connectivity

### Excel file corrupted:
1. Ensure Excel is up-to-date
2. Try exporting as CSV instead
3. Check browser disk space

### Missing data in results:
1. Verify all selected entities exist in D365F
2. Check user permissions for those entities
3. Try single LE extraction first

## 📈 Performance Benchmarks

Typical extraction times (on standard hardware):

| Legal Entities | Entities | Estimated Time |
|---|---|---|
| 5 | 5 | 1-2 min |
| 25 | 5 | 3-5 min |
| 50 | 5 | 5-8 min |
| 100 | 5 | 10-15 min |
| 100 | 10 | 15-25 min |

## ⚡ Performance, Reliability, and Limits

### Performance impact
- The extractor runs one OData request per selected entity (not per legal entity).
- A built-in throttle adds ~80ms delay between entity requests and page requests.
- With large entity lists, delay overhead alone can be significant before network/server time.
- Large entities increase runtime because all `@odata.nextLink` pages are fetched.

### Reliability behavior
- Multiple URL patterns are attempted per entity to improve compatibility across environments.
- Pagination is supported and follows `@odata.nextLink` until all pages are read.
- Failed entities are skipped and extraction continues; results can be partially complete.
- There is currently no automatic retry/backoff for transient `429/5xx` responses.

### Data record restrictions
- Data visibility is permission-based: users only extract entities/records they can read.
- Legal entity filtering keeps selected companies plus global rows.
- High-volume transactional entities are intentionally excluded for performance reasons.
- Some DMF target entities might not be exposed as OData collections in every environment/version.
- Legal entity discovery requests use `$top=1000`, so very large environments may need pagination hardening.

## 🔄 Version Status

This project is currently in pre-release and has not been officially released yet.

### Unreleased (working draft)
- Sidebar-first extraction workflow
- Multi-format export support (XLSX/CSV/JSON/TXT)
- Configurable output (Data and/or Comparison)
- Expanded module/entity coverage across 16 modules
- Summary output enhancements:
   - Skipped entities list
   - Excel Copilot reconciliation prompt
- Performance/reliability notes and operational limits documented

## 📝 License

This extension is provided as-is for internal use within your organization.

## 🤝 Contributing

To contribute improvements:
1. Create a feature branch
2. Implement your changes
3. Test with 5+ legal entities
4. Submit pull request with description

## 📞 Support

For issues or feature requests:
1. Check the Troubleshooting section
2. Review browser console logs (F12)
3. Contact your IT department
4. Submit an issue with:
   - Extension version
   - Browser & version
   - D365F environment URL (masked)
   - Error message (if any)

## 🚀 Future Enhancements

Planned features:
- [ ] Real-time sync capability
- [ ] Custom entity mapping
- [ ] Scheduled automatic extractions
- [ ] Slack/Teams integration for results
- [ ] Advanced filtering options
- [ ] Configuration rollback capability
- [ ] Audit trail export

---

**Happy Extracting! 🎉**
