# D365 Finance Configuration Extractor

**Version 1.0.0** — First public release

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

**General Ledger (27 entities):**
- Chart of Accounts, Main Accounts & Categories
- Ledgers, Journal Names & Account Structures
- Allocation Rules, Sources & Destinations
- Fiscal Calendars & Periods
- Currencies & Exchange Rate Types
- Posting Definitions & Financial Reasons
- Intercompany Accounts & Elimination Rules

**Accounts Receivable (38 entities):**
- Customer Groups & Posting Profiles
- Payment Methods, Schedules & Terms
- Cash Discounts & Aging Periods
- Collections, Interest & Write-Off Setup
- Credit Management Groups & Rules
- Direct Debit Mandates
- Delivery Terms & Modes

**Accounts Payable (18 entities):**
- Vendor Posting Profiles (PostingProfileHeaders / PostingProfileLines)
- Vendor Payment Methods & Fees
- Vendor Parameters & Form Setups
- Invoice Policy Rule Types
- Journal Names & Cheque Layouts

**Cash & Bank Management (19 entities):**
- Bank Accounts, Groups & Parameters
- Bank Cheque & Bill of Exchange Layouts
- Reconciliation Match Rule Sets
- Cash Accounts & Cash Ledgers
- Payment Purpose Codes & IDs

**Fixed Assets (22 entities):**
- Asset Groups & Parameters
- Depreciation Profiles & Value Model Setups
- Asset Books (V2), Acquisition Methods
- Posting Profiles & Disposal Profiles
- Asset Locations, Conditions & Major Types
- Revaluation Groups & Reduction Entry Profiles

**Tax (30 entities):**
- Tax Codes (TaxCodes), Tax Groups, Item Tax Groups
- Tax Parameters & Authorities
- Withholding Tax Codes, Groups & Periods
- Withholding Tax Ledger Posting Groups, Limits, Code Values & Group Details
- Tax Exempt Codes, Intrastat Commodity & Transaction Codes
- Tax Reporting Code Entities & Registration Groups
- Withholding Certificates & Component Groups

**Inventory Management (24 entities):**
- Item Groups, Model Groups & Dimension Groups
- Inventory Parameters & Posting Setup
- Warehouses & Reservation Hierarchies
- Quality Groups, Test Groups & Instruments
- Counting Groups & Blocking Reasons

**Project Management (16 entities):**
- Project Parameters, Groups & Contract Types
- Categories, Category Groups & Posting Profiles
- Resource Setup & Period Types
- Worker Cost/Sales Prices & Forecast Models
- Cost Templates & Estimate Models

### Additional Module Coverage:

- Consolidation (3 entities)
- Manufacturing (9 entities)
- Human Resources (15 entities)
- Procurement (9 entities)
- Sales (10 entities)
- Organization Admin (17 entities)
- Budget (18 entities)
- Cost Accounting (15 entities)

## 📋 Complete Entity Reference

Entity names below are the confirmed OData public collection names as exposed by D365F `/data` service document.

### General Ledger
`MainAccounts`, `MainAccountCategories`, `ChartOfAccounts`, `Ledgers`, `JournalNames`, `AccountStructures`, `LedgerAdvancedRuleStructures`, `LedgerEliminationRules`, `LedgerEliminationRuleLines`, `LedgerInterCompanyAccounts`, `LedgerAutomaticTransactionAccounts`, `LedgerFinancialReasons`, `AllocationRules`, `AllocationRuleSources`, `AllocationRuleDestinations`, `FiscalPeriods`, `FiscalCalendarsEntity`, `FiscalCalendarYears`, `PostingDefinitions`, `PostingDefinitionEntries`, `ConsolidateAccountGroups`, `JournalControls`, `AccrualSchemes`, `BalanceControls`, `DimensionRuleGoups`, `Currencies`, `ExchangeRateTypes`

### Accounts Receivable
`AgingPeriodDefinitions`, `CashDiscounts`, `PaymentTerms`, `PaymentDays`, `PaymentDayLinesCds`, `PaymentSchedules`, `PaymentScheduleLines`, `DeliveryTerms`, `DeliveryModesV2`, `FormatCodes`, `DueDateLimits`, `PaymentCalendars`, `PaymentCalendarRules`, `PaymentCalendarExceptions`, `PaymentInstructions`, `ChargesTolerances`, `ElectronicPaymentTypes`, `ElectronicPaymentWays`, `ElectronicPaymentSegments`, `CustomerGroups`, `CustomerPostingProfiles`, `CustomerPostingProfileLines`, `CustomerParameters`, `CustomerPaymentMethods`, `CustomerPaymentMethodSpecifications`, `CustomerStatisticsGroups`, `CustomerPaymentFees`, `CustomerPaymentFineCodes`, `CustomerCollectionLetterCodes`, `CreditManagementGroups`, `CreditManagementParameters`, `CreditLimitRules`, `CreditLimitRuleLines`, `DirectDebitMandates`, `CustomerWriteOffCodes`, `CustomerInterestCodes`, `CustomerInterestCodeLines`, `CustomerJournalNames`

### Accounts Payable
`VendorParameters`, `VendorPaymentMethods`, `VendorPaymentMethodSpecifications`, `PostingProfileHeaders`, `PostingProfileLines`, `VendorFormSetups`, `VendorPaymentFees`, `VendorPaymentFineCodes`, `VendorPaymentInterestCodes`, `VendorExceptionGroups`, `VendorPriceToleranceGroups`, `VendInvoicePolicyRuleTypes`, `CustomChequeLayouts`, `VendorPaymFeeGroups`, `VendPaymModeBankAccounts`, `BankPaymentTransactionCodes`, `Tax1099Fields`, `VendorJournalNames`

### Cash & Bank Management
`BankAccounts`, `BankParameters`, `BankGroups`, `BankTransactionTypes`, `BankTransactionGroups`, `BankCheckLayouts`, `BankBillOfExchangeLayouts`, `BankPromissoryNoteLayouts`, `BankPaymentIds`, `BankAccountTraps`, `ReconciliationMatchRuleSets`, `BankClientDocumentTypes`, `CashAccounts`, `CashLedgers`, `ImportModes`, `PaymentPurposeCodes`, `PaymFeeBankRules`, `DocumentFacilityGroups`, `DocumentFacilityTypes`

### Fixed Assets
`FixedAssetGroups`, `AssetParameters`, `DepreciationProfiles`, `ValueModelSetups`, `FixedAssetPostingProfiles`, `FixedAssetPostingProfileDisposals`, `AcquisitionMethods`, `FixedAssetBooksV2`, `FixedAssetGroupValueModelSetups`, `AcceleratedDepreciationGroups`, `AssetActivityCodes`, `AssetConditions`, `AssetLocations`, `AssetMajorTypes`, `DepreciationGroups`, `AssetConsumptionUnits`, `InventoryFixedAssetTransferJournalNames`, `ReductionEntryProfiles`, `RevaluationGroups`, `DiscountRates`, `AssetStatementRows`, `AssetAllocationRules`

### Tax
`TaxParameters`, `TaxCodes`, `TaxGroups`, `TaxItemGroups`, `TaxExemptCodes`, `TaxAuthorities`, `TaxPeriodHeads`, `TaxPeriods`, `WithholdingTaxCodes`, `WithholdingGroups`, `WithholdingPeriods`, `WithholdingTaxLedgerPostingGroups`, `WithholdingTaxLimits`, `WithholdingTaxCodeValues`, `WithholdingTaxGroupDetails`, `TaxReportingCodeEntities`, `TaxRegistrationGroups`, `TaxPostingGroups`, `IntrastatCommodityCodes`, `IntrastatTransactionCodes`, `IntrastatCodes`, `IntrastatPorts`, `RegistrationTypes`, `TaxGroupDatas`, `TaxItemGroupHeadings`, `WithholdCertificates`, `WithholdAuthorities`, `WithholdComponentGroups`, `WithholdComponents`, `WithholdItemGroups`

### Inventory Management
`ItemGroups`, `InventoryParameters`, `InventoryModelGroups`, `InventoryModelGroupPolicies`, `InventoryDimensionGroups`, `InventoryStorageDimensionGroups`, `InventoryTrackingDimensionGroups`, `Warehouses`, `InventoryPostingSetup`, `InventPostingProfiles`, `ItemSetupSupplyTypes`, `InventInventoryLedgerPostingDefinitionEntity`, `InventInventoryProfileCustomerVendorLedgerEntity`, `InventoryReservationHierarchies`, `InventoryOwnerGroups`, `InventTestGroups`, `InventTestGroupMembers`, `InventQualityGroups`, `InventItemQualityGroups`, `InventTestInstruments`, `InventTestVariables`, `InventCountingGroups`, `InventBlockingReasons`, `InventTransferParameters`

### Project Management
`ProjectParameters`, `ProjectGroups`, `ProjectContractTypes`, `ProjectCategories`, `ProjCategoryGroup`, `ProjectPostingProfiles`, `ProjLedgerPostingDefinitionEntity`, `ProjectHourUtilizationSetup`, `ProjectResourceSetup`, `ProjectPeriodTypes`, `ProjectWorkerCostPrice`, `ProjectWorkerSalesPrice`, `ProjectFundingSourceGroups`, `ProjectEstimateModels`, `ProjectForecastModels`, `ProjectCostTemplates`

### Organization Admin
`CompanyInfo`, `NumberSequenceGroups`, `OperatingUnits`, `OrganizationHierarchyTypes`, `OrganizationHierarchyPurposes`, `Departments`, `Divisions`, `Teams`, `NumberSequenceCodes`, `NumberSequenceReferences`, `NumberSequenceGroupReferences`, `AddressBooks`, `AddressBookParameters`, `CountryRegions`, `LanguageTexts`, `TimeZones`, `LegalEntityPostalAddresses`

### Budget
`BudgetParameters`, `BudgetModels`, `BudgetCycles`, `BudgetControlConfigurations`, `BudgetControlRules`, `BudgetControlGroups`, `BudgetPlanProcesses`, `BudgetPlanStages`, `BudgetPlanLayouts`, `BudgetPlanPriorities`, `BudgetPlanScenarios`, `BudgetAllocationTerms`, `BudgetCodes`, `BudgetDimensions`, `BudgetPlanParameters`, `BudgetPlanColumnRules`, `BudgetControlDocumentsAndJournals`, `BudgetControlDimensionAttributes`

### Cost Accounting
`CostAccountingLedger`, `CostAccountingParameters`, `CostElements`, `CostElementDimensions`, `CostCenters`, `CostAllocationBases`, `CostAllocationRules`, `CostAllocationPolicies`, `CostDistributionPolicies`, `CostAccountingOverheadRates`, `CostAccountingCostGroups`, `CostObjects`, `CostBehaviors`, `CostControlUnits`, `CostAccountingDimensions`

### Manufacturing
`ProductionParameters`, `BOMParameters`, `RouteGroups`, `RouteCostCategories`, `ProductionPoolGroups`, `ProductionFlushingPrinciples`, `BOMCalculationGroups`, `ProductionGroups`, `ProductionUnits`

### Human Resources
`HumanResourceParameters`, `HumanResourceJobs`, `HumanResourceJobFunctions`, `HumanResourceDepartments`, `BenefitTypes`, `BenefitPlans`, `CompensationPlans`, `CompensationLevels`, `CompensationGrids`, `CompensationPayFrequency`, `CompensationStructure`, `PositionTypes`, `PositionHierarchyTypes`, `JobTaskAreas`, `BenefitEligibilityRules`

### Procurement
`VendorGroups`, `ProcurementProductCategories`, `VendVendorCertificationTypeEntities`, `VendorReasons`, `PriceTolerances`, `VendorInvoiceTotalTolerances`, `LineDiscountVendorGroups`, `MultilineDiscountVendorGroups`, `TotalDiscountVendorGroups`

### Sales
`TradeAgreementJournalNames`, `SalesOrderPools`, `SalesOrderHoldCodes`, `ReturnDispositionCodes`, `SalesCarriers`, `CustomerChargeGroup`, `LineDiscountCustomerGroups`, `MultilineDiscountCustomerGroups`, `TotalDiscountCustomerGroups`, `SalesContactPersonTitles`

### Consolidation
`ConsolidationAccountGroups`, `LedgerEliminationRules`, `LedgerEliminationRuleLines`

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

### From the Store (v1.0.0):

The extension is available on:
- [Chrome Web Store](https://chrome.google.com/webstore) — search "D365 Finance Configuration Extractor"
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons) — search "D365 Finance Configuration Extractor"
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
   'TaxCodes',        // correct OData name (not SalesTaxCodes)
   'YourNewEntity'    // Add new OData collection name here
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

### Excel file corrupted or "Maximum call stack size exceeded":
1. Very large exports (400k+ records) can exhaust the browser's JS call stack during serialisation.
   - Each entity sheet is capped at **50,000 rows** — a `⚠` note appears on capped sheets.
   - If you need all rows for a high-volume entity, export that module separately.
2. Ensure Excel is up-to-date
3. Try exporting as CSV instead for very large datasets
4. Check browser disk space

### Missing data in results:
1. Verify all selected entities exist in D365F
2. Check user permissions for those entities
3. Try single LE extraction first
4. Review the skipped entities reason:
   - `Entity set not found in /data service document` = configured name is not exposed as an endpoint in this environment
   - `Endpoint resolved (...) but returned 0 rows` = endpoint is valid but has no records for your scope
   - `Endpoint call failed ...` = permissions/OData exposure/network issue

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
- Entity endpoints are validated against the live OData service document (`/data`) before calls.
- Alternate naming patterns are auto-tried (for example `Entity` suffix and common singular/plural variants).
- Multiple URL patterns are attempted per resolved entity set to improve compatibility across environments.
- Pagination is supported and follows `@odata.nextLink` until all pages are read.
- Failed entities are skipped and extraction continues; results can be partially complete.
- There is currently no automatic retry/backoff for transient `429/5xx` responses.

### Data record restrictions
- Data visibility is permission-based: users only extract entities/records they can read.
- Legal entity filtering keeps selected companies plus global rows.
- High-volume transactional entities are intentionally excluded for performance reasons.
- Some DMF target entities might not be exposed as OData collections in every environment/version.
- Legal entity discovery requests use `$top=1000`, so very large environments may need pagination hardening.

## 🔄 Version History

### v1.0.0 — June 2026 (First Release)
- Sidebar-first extraction workflow
- Multi-format export support (XLSX/CSV/JSON/TXT)
- Configurable output (Data and/or Comparison)
- 285 entities across 16 D365F modules
- Summary output with skipped entities list
- Excel Copilot reconciliation prompt embedded in exports
- Session-based authentication (no credentials stored)
- IndexedDB-backed performance for large-scale extractions
- Endpoint auto-validation against live OData service document

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
