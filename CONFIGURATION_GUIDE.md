# Configuration Master Data - Entity Guide
**D365 Finance Configuration Extractor — v1.0.0**

This guide explains the configuration master data entities available for extraction and how to add more.

## Overview

The D365 Finance Configuration Extractor extracts configuration (not transactional) master data from Dynamics 365 Finance across multiple legal entities. Configuration entities are typically setup/reference data that control business processes, as opposed to transactional data (invoices, orders, journals, etc.).

## Current Module Coverage

Current module/entity coverage in the extractor:

| Module | Configured Entities |
|---|---|
| General Ledger | 27 |
| Accounts Receivable | 38 |
| Accounts Payable | 18 |
| Cash & Bank Management | 19 |
| Fixed Assets | 22 |
| Tax | 26 |
| Consolidation | 3 |
| Inventory Management | 24 |
| Project Management | 16 |
| Manufacturing | 9 |
| Human Resources | 15 |
| Procurement | 9 |
| Sales | 10 |
| Organization Admin | 16 |
| Budget | 18 |
| Cost Accounting | 15 |

Total configured extraction list: 285 entities across 16 modules.

## Supported Configuration Categories

### 1. **Tax & Duty Configuration** 
Located in: **General Ledger** and **Tax** modules

#### Tax Codes & Groups:
- `TaxCodes` - Sales tax code master (OData name — not SalesTaxCodes)
- `TaxGroups` - Groups of sales tax codes (OData name — not SalesTaxGroups)
- `TaxItemGroups` - Tax groups assigned to items (OData name — not ItemSalesTaxGroups)
- `WithholdingTaxCodes` - Withholding tax codes
- `WithholdingGroups` - Withholding tax code groups
- `TaxExemptCodes` - Tax exemption codes

#### Tax Setup & Parameters:
- `TaxParameters` - Global tax parameters
- `TaxAuthorities` - Tax authorities
- `TaxPeriodHeads` / `TaxPeriods` - Tax settlement/reporting periods
- `TaxRegistrationGroups` - Tax registration types
- `TaxPostingGroups` - Tax posting configuration
- `TaxReportingCodeEntities` - Tax reporting codes
- `IntrastatCommodityCodes` - Intrastat commodity codes
- `IntrastatTransactionCodes` / `IntrastatCodes` / `IntrastatPorts` - Intrastat setup
- `RegistrationTypes` - Registration types
- `WithholdCertificates`, `WithholdAuthorities`, `WithholdComponentGroups`, `WithholdComponents`, `WithholdItemGroups` - Withholding detail setup
- `TaxReportingCodes` - Tax reporting codes
- `TaxFreeAccounts` - Tax-free accounts

### 2. **Payment Schedule & Terms Configuration**
Located in: **Accounts Receivable**, **Accounts Payable** modules

#### Customer Payments:
- `CustomerPaymentMethods` - Payment methods for customers
- `CustomerPaymentMethodSpecifications` - Payment method details
- `CustomerPaymentSchedules` - Customer payment schedules
- `CustomerPaymentScheduleLines` - Payment schedule lines
- `PaymentTerms` - Payment term codes
- `PaymentDays` - Payment day definitions
- `PaymentDayLines` - Payment day details
- `CashDiscounts` - Early payment discounts

#### Vendor Payments:
- `VendorPaymentMethods` - Payment methods for vendors
- `VendorPaymentMethodSpecifications` - Payment method details
- `VendorPaymentSchedules` - Vendor payment schedules
- `VendorPaymentScheduleLines` - Payment schedule lines

### 3. **Posting Profiles**
Located in: **Accounts Receivable**, **Accounts Payable**, **Inventory Management**, **Fixed Assets**, **Project Management** modules

Common posting profile types:
- `CustomerPostingProfiles` - AR posting profiles
- `CustomerPostingProfileLines` - AR posting profile lines
- `VendorPostingProfiles` - AP posting profiles
- `VendorPostingProfileLines` - AP posting profile lines
- `InventPostingProfiles` - Inventory posting profiles
- `InventInventoryProfileCustomerVendorLedgerEntity` - Inventory profile posting setup entity (MS Learn CDM)
- `FixedAssetPostingProfiles` - Fixed asset posting profiles
- `FixedAssetPostingProfileLines` - Fixed asset posting profile lines
- `AssetPostingProfileEntity` - Fixed asset posting profile entity (MS Learn CDM)
- `AssetPostingProfileDisposalEntity` - Fixed asset posting profile disposal entity (MS Learn CDM)
- `ProjectPostingProfiles` - Project posting profiles
- `ProjPostingProfileLines` - Project posting profile lines (legacy naming)
- `ProjLedgerPostingDefinitionEntity` - Project ledger posting definition entity (MS Learn CDM)

### 4. **Chart of Accounts & Ledger Setup**
Located in: **General Ledger** module

- `MainAccounts` - Main account (GL account) master
- `MainAccountCategories` - Categories for main accounts
- `LedgerChartOfAccounts` - Chart of accounts
- `LedgerParameters` - Ledger parameters
- `GeneralLedgerParameters` - GL parameters
- `Currencies` - Currency setup
- `ExchangeRateTypes` - Exchange rate type definitions

### 5. **Dimension Configuration**
Located in: **General Ledger** module

- `DimensionAttributes` - Financial dimension attributes
- `DimensionAttributeLegalEntityOverrides` - LE-specific dimension overrides
- `DimensionHierarchies` - Dimension hierarchies
- `DimensionHierarchyNodes` - Hierarchy nodes
- `DimensionSets` - Dimension sets
- `DimensionSetLines` - Dimension set lines
- `FinancialDimensionDefaultTemplates` - Default dimension templates

### 6. **Vendor & Customer Master Setup**
Located in: **Accounts Receivable**, **Accounts Payable** modules

- `CustomerGroups` - Customer grouping
- `CustomerPostingProfiles` - Customer posting setup
- `VendorGroups` - Vendor grouping
- `VendorPostingProfiles` - Vendor posting setup
- `VendorCategories` - Vendor categories
- `VendorCertificateTypes` - Vendor certification types
- `CustomerCharges` - Default charges for customers
- `VendorCharges` - Default charges for vendors
- `TradeAgreementJournalNames` - Trade agreement journal setup

### 7. **Inventory & Warehouse Configuration**
Located in: **Inventory Management** module

- `ItemGroups` - Item/product groups
- `InventoryParameters` - Inventory parameters
- `InventoryModelGroups` - Inventory model groups (FIFO, LIFO, etc.)
- `InventoryDimensionGroups` - Inventory dimension grouping
- `Warehouses` - Warehouse setup
- `InventoryPostingSetup` - Inventory posting configuration
- `InventPostingProfiles` - Inventory posting profiles
- `InventTestGroups` - Quality test groups
- `InventQualityGroups` - Quality groups for items

### 8. **Bank & Cash Management**
Located in: **Cash & Bank Management** module

- `BankAccounts` - Bank account setup
- `BankAccountTypes` - Bank account type definitions
- `BankParameters` - Bank parameters
- `BankStatementFormats` - Import statement format setup
- `BankChequeLayouts` - Cheque format definitions
- `BankReconciliationMatchRules` - Reconciliation rules
- `CashFlowForecastAccounts` - Cash flow accounts
- `BridgingAccounts` - Bridging account setup

### 9. **Fixed Asset Configuration**
Located in: **Fixed Assets** module

- `FixedAssetGroups` - Asset groups
- `FixedAssetParameters` - Asset parameters
- `FixedAssetBooks` - Asset books/value models
- `FixedAssetPostingProfiles` - Asset posting profiles
- `FixedAssetDepreciationProfiles` - Depreciation profiles
- `FixedAssetComponents` - Asset component setup
- `FixedAssetConditionCodes` - Asset condition codes

### 10. **Organization & Admin Configuration**
Located in: **Organization Admin** module

- `CompanyInfo` - Legal entity information
- `OperatingUnits` - Operating unit setup
- `Departments` - Departments
- `Divisions` - Divisions
- `Teams` - Teams
- `NumberSequenceGroups` - Number sequence groups
- `NumberSequenceCodes` - Number sequence setup
- `NumberSequenceReferences` - Number sequence assignments
- `OrganizationHierarchyTypes` - Org hierarchy types
- `OrganizationHierarchyPurposes` - Hierarchy purposes

### 11. **Budgeting & Planning**
Located in: **Budget** module

- `BudgetParameters` - Budget parameters
- `BudgetModels` - Budget models
- `BudgetCycleTimeSpans` - Budget cycle setup
- `BudgetControlConfiguration` - Budget control config
- `BudgetControlRules` - Budget control rules
- `BudgetPlanningProcesses` - Planning processes
- `BudgetPlanningStages` - Planning stages

### 12. **Project Management**
Located in: **Project Management** module

- `ProjectParameters` - Project parameters
- `ProjectGroups` - Project groups
- `ProjectCategories` - Project categories
- `ProjectPostingProfiles` - Project posting profiles
- `ProjectBillingRules` - Billing rules
- `ProjectResourceSetup` - Resource setup
- `ProjectWorkerCostPrice` - Worker cost pricing

### 13. **Cost Accounting**
Located in: **Cost Accounting** module

- `CostAccountingLedger` - Cost accounting ledger
- `CostAccountingParameters` - Parameters
- `CostElements` - Cost elements
- `CostCenters` - Cost centers
- `CostAllocationBases` - Allocation bases
- `CostAllocationRules` - Allocation rules
- `CostAccountingCostGroups` - Cost groups

### 14. **Procurement**
Located in: **Procurement** module

- `PurchasePolicies` - Procurement policy setup
- `PurchaseSetup` - Purchasing setup parameters
- `ProcurementCategories` - Procurement categories
- `ProcurementCategoryHierarchies` - Category hierarchy setup
- `ProcurementCategoryAccessPolicies` - Category access governance
- `VendorProcurementCategories` - Vendor-category mapping
- `VendorEvaluationCriteria` - Vendor evaluation criteria
- `VendorEvaluationCriterionGroups` - Evaluation groups
- `VendorEvaluationScoringModels` - Scoring models
- `PurchaseRequisitionParameters` - Requisition setup
- `RequestForQuotationParameters` - RFQ setup
- `PurchaseAgreementClassifications` - Purchase agreement classification setup

## How to Add New Configuration Entities

### Step 1: Identify the Module & OData Entity Name

1. Navigate to the D365F feature in your environment
2. Open **Organization Administration > Data Management > Framework Configuration > Entity List**
3. Search for your entity (e.g., "Tax Code")
4. Note the exact **Entity Name** (appears in the Name column)
5. Determine which **Module** it belongs to (General Ledger, Accounts Payable, etc.)

Important:
- Data management entity names and OData entity set names can differ in some environments.
- The extractor now validates configured names against the live `/data` service document and automatically tries common name variants.

### Step 2: Update the moduleODataMap

Edit `src/sidebar/sidebar.js` and locate the `moduleODataMap` object:

```javascript
const moduleODataMap = {
    'Your Module Name': [
        'ExistingEntity1',
        'ExistingEntity2',
        'NewEntity'  // ← Add here
    ],
    // ... rest of modules
};
```

**Example:** Add "TaxIntervals" to the Tax module:

```javascript
'Tax': [
    'TaxParameters',
    'SalesTaxCodes',
    // ... existing entities
    'TaxIntervals'  // ← Add new entity
]
```

### Step 3: Update the Module Count

Update the `D365F_MODULES` object to reflect the new entity count:

```javascript
const D365F_MODULES = {
    'Tax': { color: '#E67E22', count: 24 },  // ← Increase count
    // ... rest
};
```

**Calculation:** Count = Number of entities in that module's array in moduleODataMap

### Step 4: Test the Addition

1. Save your changes
2. Reload the extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the D365 Finance Configuration Extractor
3. Log into D365F
4. Open the sidebar and select the updated module
5. Verify that the new entity is included in the extraction

### Step 5: Update Documentation

Update `README.md` to document the new entity:

1. Add the entity to the appropriate section in the entity reference
2. Update the module description if needed
3. Commit your changes

## OData Query Format

Internally, the extension queries entities using OData v4:

```
GET https://{environment}.dynamics.com/data/{EntitySetName}?cross-company=true&$top=1000
```

Example for Tax Codes:
```
GET https://yourenvironment.dynamics.com/data/SalesTaxCodes?cross-company=true&$top=1000
```

Fallback patterns are also attempted automatically:
- `GET /data/{EntitySetName}?$top=1000`
- `GET /_odata/v1/{EntitySetName}?cross-company=true&$top=1000`

The extension automatically:
- Filters by selected legal entities (using DataAreaId)
- Exports in multiple formats (Excel, CSV, JSON, Text)
- Generates comparison reports

## Entity Naming Conventions

Common D365F OData entity naming patterns:

| Configuration Type | Naming Pattern | Example |
|---|---|---|
| Setup/Master | `{Module}{Entity}` | `SalesTaxCodes`, `BankAccounts` |
| Groups | `{Module}{Entity}Groups` | `InventoryModelGroups`, `CostCenters` |
| Parameters | `{Module}Parameters` | `LedgerParameters`, `BankParameters` |
| Profiles | `{Module}PostingProfiles` | `CustomerPostingProfiles`, `FixedAssetPostingProfiles` |
| Details/Lines | `{Master}Lines` | `PurchaseOrderLines`, `SalesOrderLines` |

## Performance Considerations

When adding new entities, consider:

1. **Entity Size**: Large entities (>10,000 records per LE) may slow extraction
   - Example: Customer master (exclude), Warehouse locations (exclude)
   - Include: Setup/configuration entities

2. **LE-Specific vs. Global**: 
   - Include LE-specific config (posting profiles, parameters)
   - Exclude global setup where not needed

3. **Dependency Entities**:
   - Add header and line entities together
   - Example: PaymentSchedules + PaymentScheduleLines

## Common Module OData Paths

Use these to explore available entities in your environment:

```
/_odata/v1/  — OData v4 endpoint
```

Example queries:
- `/GeneralLedgers`
- `/MainAccounts`
- `/SalesTaxCodes`
- `/BankAccounts`
- `/FixedAssetGroups`

## Troubleshooting

### Entity not extracting?
1. Verify exact entity name (case-sensitive in some contexts)
2. Check OData accessibility in your D365F environment
3. Review browser console for errors (F12 > Console tab)

### Getting "No data returned"?
1. Entity might not have records for selected LEs
2. User might lack read permissions
3. Entity might require specific security roles

### Performance issues?
1. Remove large transactional entities
2. Split large modules into separate extractions
3. Extract fewer legal entities at once

## References

- [Dynamics 365 Finance OData Reference](https://docs.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/fin-pubs-service-entity-ref)
- [Data Management Framework](https://docs.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/data-entities-data-packages)
- [Configure Ledger Posting](https://docs.microsoft.com/en-us/dynamics365/finance/general-ledger/configure-ledger-posting)
