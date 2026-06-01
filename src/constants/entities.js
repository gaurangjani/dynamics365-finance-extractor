// Comprehensive Dynamics 365 Finance entities for all modules
// Organized by module with core configuration entities

const D365F_MODULES = {
    'General Ledger': {
        color: '#0078D4',
        icon: '📊',
        description: 'General ledger setup and accounting configuration'
    },
    'Accounts Receivable': {
        color: '#7FBA00',
        icon: '💰',
        description: 'Customer and AR configuration'
    },
    'Accounts Payable': {
        color: '#FFB900',
        icon: '💳',
        description: 'Vendor and AP configuration'
    },
    'Inventory Management': {
        color: '#00D4FF',
        icon: '📦',
        description: 'Inventory and stock management setup'
    },
    'Project Management': {
        color: '#6C63FF',
        icon: '🎯',
        description: 'Project accounting and management'
    },
    'Manufacturing': {
        color: '#E74C3C',
        icon: '🏭',
        description: 'Production and manufacturing setup'
    },
    'Fixed Assets': {
        color: '#9B59B6',
        icon: '🏢',
        description: 'Fixed asset configuration'
    },
    'Cash Management': {
        color: '#1ABC9C',
        icon: '🏦',
        description: 'Bank and cash setup'
    },
    'Human Resources': {
        color: '#F39C12',
        icon: '👥',
        description: 'HR and payroll configuration'
    },
    'Procurement': {
        color: '#34495E',
        icon: '🛒',
        description: 'Purchasing and procurement setup'
    },
    'Sales': {
        color: '#C0392B',
        icon: '📈',
        description: 'Sales and marketing configuration'
    },
    'Organization Admin': {
        color: '#8E44AD',
        icon: '⚙️',
        description: 'Legal entities and organization setup'
    }
};

const D365F_ENTITIES = {
    // ===== GENERAL LEDGER (13 entities) =====
    'Ledgers': {
        name: 'Ledgers',
        displayName: 'Ledger Setup',
        module: 'General Ledger',
        odataCollection: 'Ledgers',
        description: 'Legal entity accounting configuration'
    },
    'MainAccounts': {
        name: 'MainAccounts',
        displayName: 'Chart of Accounts',
        module: 'General Ledger',
        odataCollection: 'MainAccounts',
        description: 'Main account definitions and hierarchies'
    },
    'DimensionHierarchies': {
        name: 'DimensionHierarchies',
        displayName: 'Dimension Hierarchies',
        module: 'General Ledger',
        odataCollection: 'DimensionHierarchies',
        description: 'Financial dimension hierarchies'
    },
    'DimensionAttributes': {
        name: 'DimensionAttributes',
        displayName: 'Dimension Attributes',
        module: 'General Ledger',
        odataCollection: 'DimensionAttributes',
        description: 'Financial dimension attribute definitions'
    },
    'LedgerParameters': {
        name: 'LedgerParameters',
        displayName: 'Ledger Parameters',
        module: 'General Ledger',
        odataCollection: 'LedgerParameters',
        description: 'General ledger module parameters'
    },
    'TaxGroups': {
        name: 'TaxGroups',
        displayName: 'Sales Tax Groups',
        module: 'General Ledger',
        odataCollection: 'TaxGroups',
        description: 'Sales tax group definitions'
    },
    'TaxCodes': {
        name: 'TaxCodes',
        displayName: 'Sales Tax Codes',
        module: 'General Ledger',
        odataCollection: 'TaxCodes',
        description: 'Sales tax code setup'
    },
    'TaxItemGroups': {
        name: 'TaxItemGroups',
        displayName: 'Tax Item Groups',
        module: 'General Ledger',
        odataCollection: 'TaxItemGroupHeadingTable',
        description: 'Tax item group configurations'
    },
    'ExchangeRateCurrencyPairs': {
        name: 'ExchangeRateCurrencyPairs',
        displayName: 'Exchange Rate Currency Pairs',
        module: 'General Ledger',
        odataCollection: 'ExchangeRateCurrencyPairs',
        description: 'Currency exchange rate setup'
    },
    'IntercompanyAccounting': {
        name: 'IntercompanyAccounting',
        displayName: 'Intercompany Setup',
        module: 'General Ledger',
        odataCollection: 'IntercompanyAccountingSetup',
        description: 'Intercompany transaction configuration'
    },
    'CompanyInfo': {
        name: 'CompanyInfo',
        displayName: 'Legal Entity Information',
        module: 'Organization Admin',
        odataCollection: 'CompanyInfos',
        description: 'Legal entity/company information'
    },
    'NumberSequences': {
        name: 'NumberSequences',
        displayName: 'Number Sequences',
        module: 'Organization Admin',
        odataCollection: 'NumberSequences',
        description: 'Number sequence setup'
    },
    'FiscalCalendars': {
        name: 'FiscalCalendars',
        displayName: 'Fiscal Calendars',
        module: 'General Ledger',
        odataCollection: 'FiscalCalendar',
        description: 'Fiscal calendar and period setup'
    },

    // ===== ACCOUNTS RECEIVABLE (8 entities) =====
    'CustomerGroups': {
        name: 'CustomerGroups',
        displayName: 'Customer Groups',
        module: 'Accounts Receivable',
        odataCollection: 'CustGroup',
        description: 'Customer group definitions'
    },
    'CustPostingProfiles': {
        name: 'CustPostingProfiles',
        displayName: 'Customer Posting Profiles',
        module: 'Accounts Receivable',
        odataCollection: 'CustPostingProfiles',
        description: 'Customer posting profile setup'
    },
    'ARParameters': {
        name: 'ARParameters',
        displayName: 'AR Parameters',
        module: 'Accounts Receivable',
        odataCollection: 'CustParameters',
        description: 'Accounts receivable module parameters'
    },
    'CustomerPaymentMethods': {
        name: 'CustomerPaymentMethods',
        displayName: 'Customer Payment Methods',
        module: 'Accounts Receivable',
        odataCollection: 'CustPaymMode',
        description: 'Customer payment method setup'
    },
    'CustomerDiscountGroups': {
        name: 'CustomerDiscountGroups',
        displayName: 'Customer Discount Groups',
        module: 'Sales',
        odataCollection: 'CustDiscGroup',
        description: 'Customer discount group configurations'
    },
    'SalesAgreements': {
        name: 'SalesAgreements',
        displayName: 'Sales Agreements',
        module: 'Sales',
        odataCollection: 'SalesAgreement',
        description: 'Sales agreement headers and terms'
    },
    'RevenueRecognitionRules': {
        name: 'RevenueRecognitionRules',
        displayName: 'Revenue Recognition Rules',
        module: 'Accounts Receivable',
        odataCollection: 'RevRecContractLineTemplate',
        description: 'Revenue recognition configuration'
    },
    'CustomerCreditLimits': {
        name: 'CustomerCreditLimits',
        displayName: 'Customer Credit Limits',
        module: 'Accounts Receivable',
        odataCollection: 'CustTable',
        description: 'Customer credit limit setup'
    },

    // ===== ACCOUNTS PAYABLE (7 entities) =====
    'VendorGroups': {
        name: 'VendorGroups',
        displayName: 'Vendor Groups',
        module: 'Accounts Payable',
        odataCollection: 'VendGroup',
        description: 'Vendor group definitions'
    },
    'VendPostingProfiles': {
        name: 'VendPostingProfiles',
        displayName: 'Vendor Posting Profiles',
        module: 'Accounts Payable',
        odataCollection: 'VendPostingProfiles',
        description: 'Vendor posting profile setup'
    },
    'APParameters': {
        name: 'APParameters',
        displayName: 'AP Parameters',
        module: 'Accounts Payable',
        odataCollection: 'VendParameters',
        description: 'Accounts payable module parameters'
    },
    'VendorPaymentMethods': {
        name: 'VendorPaymentMethods',
        displayName: 'Vendor Payment Methods',
        module: 'Accounts Payable',
        odataCollection: 'VendPaymMode',
        description: 'Vendor payment method setup'
    },
    'VendorDiscountGroups': {
        name: 'VendorDiscountGroups',
        displayName: 'Vendor Discount Groups',
        module: 'Procurement',
        odataCollection: 'VendDiscGroup',
        description: 'Vendor discount group configurations'
    },
    'PurchaseAgreements': {
        name: 'PurchaseAgreements',
        displayName: 'Purchase Agreements',
        module: 'Procurement',
        odataCollection: 'PurchAgreement',
        description: 'Purchase agreement headers and terms'
    },
    'PaymentTerms': {
        name: 'PaymentTerms',
        displayName: 'Payment Terms',
        module: 'Accounts Payable',
        odataCollection: 'PaymTerm',
        description: 'Payment terms and conditions setup'
    },

    // ===== INVENTORY MANAGEMENT (10 entities) =====
    'ItemGroups': {
        name: 'ItemGroups',
        displayName: 'Item Groups',
        module: 'Inventory Management',
        odataCollection: 'ItemGroupTable',
        description: 'Item group definitions'
    },
    'ItemCategories': {
        name: 'ItemCategories',
        displayName: 'Item Categories',
        module: 'Inventory Management',
        odataCollection: 'EcoResCategoryTable',
        description: 'Item category definitions'
    },
    'InventoryParameters': {
        name: 'InventoryParameters',
        displayName: 'Inventory Parameters',
        module: 'Inventory Management',
        odataCollection: 'InventParameters',
        description: 'Inventory management parameters'
    },
    'InventPostingGroups': {
        name: 'InventPostingGroups',
        displayName: 'Inventory Posting Groups',
        module: 'Inventory Management',
        odataCollection: 'InventPostingGroup',
        description: 'Inventory posting group setup'
    },
    'InventPostingProfiles': {
        name: 'InventPostingProfiles',
        displayName: 'Inventory Posting Profiles',
        module: 'Inventory Management',
        odataCollection: 'InventPostingProfiles',
        description: 'Inventory posting profile setup'
    },
    'StorageDimensions': {
        name: 'StorageDimensions',
        displayName: 'Storage Dimensions',
        module: 'Inventory Management',
        odataCollection: 'InventDimGroupTable',
        description: 'Storage dimension group setup'
    },
    'TrackingDimensions': {
        name: 'TrackingDimensions',
        displayName: 'Tracking Dimensions',
        module: 'Inventory Management',
        odataCollection: 'InventDimGroupTable',
        description: 'Tracking dimension configurations'
    },
    'InventoryCosting': {
        name: 'InventoryCosting',
        displayName: 'Inventory Costing Method',
        module: 'Inventory Management',
        odataCollection: 'InventModelGroup',
        description: 'Inventory costing model setup'
    },
    'WarehouseLocationFormats': {
        name: 'WarehouseLocationFormats',
        displayName: 'Warehouse Location Formats',
        module: 'Inventory Management',
        odataCollection: 'WMSLocationIdPrefix',
        description: 'Warehouse location format setup'
    },
    'InventoryUnitConversions': {
        name: 'InventoryUnitConversions',
        displayName: 'Unit Conversions',
        module: 'Inventory Management',
        odataCollection: 'UnitOfMeasureConversion',
        description: 'Unit of measure conversion setup'
    },

    // ===== PROJECT MANAGEMENT (8 entities) =====
    'ProjectCategories': {
        name: 'ProjectCategories',
        displayName: 'Project Categories',
        module: 'Project Management',
        odataCollection: 'ProjCategory',
        description: 'Project category definitions'
    },
    'ProjectContracts': {
        name: 'ProjectContracts',
        displayName: 'Project Contracts',
        module: 'Project Management',
        odataCollection: 'ProjContractTable',
        description: 'Project contract setup'
    },
    'ProjectParameters': {
        name: 'ProjectParameters',
        displayName: 'Project Parameters',
        module: 'Project Management',
        odataCollection: 'ProjParameters',
        description: 'Project module parameters'
    },
    'ProjectPostingProfiles': {
        name: 'ProjectPostingProfiles',
        displayName: 'Project Posting Profiles',
        module: 'Project Management',
        odataCollection: 'ProjPostingProfile',
        description: 'Project posting profile setup'
    },
    'ProjectBudgets': {
        name: 'ProjectBudgets',
        displayName: 'Project Budgets',
        module: 'Project Management',
        odataCollection: 'ProjBudgetTable',
        description: 'Project budget and forecasts'
    },
    'ProjectAgreements': {
        name: 'ProjectAgreements',
        displayName: 'Project Agreements',
        module: 'Project Management',
        odataCollection: 'ProjAgreementTable',
        description: 'Project agreement setup'
    },
    'ProjectInvoiceProposals': {
        name: 'ProjectInvoiceProposals',
        displayName: 'Project Invoice Setup',
        module: 'Project Management',
        odataCollection: 'ProjInvoiceTable',
        description: 'Project invoicing configuration'
    },
    'ProjectResourceRates': {
        name: 'ProjectResourceRates',
        displayName: 'Project Resource Rates',
        module: 'Project Management',
        odataCollection: 'ProjEmplTrans',
        description: 'Project resource rate setup'
    },

    // ===== MANUFACTURING (9 entities) =====
    'ProductionParameters': {
        name: 'ProductionParameters',
        displayName: 'Production Parameters',
        module: 'Manufacturing',
        odataCollection: 'ProdParameters',
        description: 'Production module parameters'
    },
    'BOMParameters': {
        name: 'BOMParameters',
        displayName: 'BOM Parameters',
        module: 'Manufacturing',
        odataCollection: 'BOMParameters',
        description: 'Bill of materials setup'
    },
    'RouteParameters': {
        name: 'RouteParameters',
        displayName: 'Route Parameters',
        module: 'Manufacturing',
        odataCollection: 'RouteTable',
        description: 'Production route setup'
    },
    'ResourceGroups': {
        name: 'ResourceGroups',
        displayName: 'Resource Groups',
        module: 'Manufacturing',
        odataCollection: 'WrkCtrResourceGroup',
        description: 'Work center resource groups'
    },
    'OperationPrices': {
        name: 'OperationPrices',
        displayName: 'Operation Prices',
        module: 'Manufacturing',
        odataCollection: 'CostSheetTable',
        description: 'Operation costing setup'
    },
    'ProductionPostingProfiles': {
        name: 'ProductionPostingProfiles',
        displayName: 'Production Posting Profiles',
        module: 'Manufacturing',
        odataCollection: 'ProdPostingProfile',
        description: 'Production posting configuration'
    },
    'LeanProductionFlows': {
        name: 'LeanProductionFlows',
        displayName: 'Lean Production Flows',
        module: 'Manufacturing',
        odataCollection: 'LeanProductionFlow',
        description: 'Lean manufacturing setup'
    },
    'QualityManagement': {
        name: 'QualityManagement',
        displayName: 'Quality Management',
        module: 'Manufacturing',
        odataCollection: 'QualityTestTable',
        description: 'Quality management configuration'
    },
    'ProductionScheduling': {
        name: 'ProductionScheduling',
        displayName: 'Production Scheduling',
        module: 'Manufacturing',
        odataCollection: 'ProdSchedule',
        description: 'Production scheduling parameters'
    },

    // ===== FIXED ASSETS (7 entities) =====
    'AssetGroups': {
        name: 'AssetGroups',
        displayName: 'Asset Groups',
        module: 'Fixed Assets',
        odataCollection: 'AssetGroup',
        description: 'Fixed asset group definitions'
    },
    'FixedAssetPostingProfiles': {
        name: 'FixedAssetPostingProfiles',
        displayName: 'Fixed Asset Posting Profiles',
        module: 'Fixed Assets',
        odataCollection: 'AssetPostingProfile',
        description: 'Fixed asset posting configuration'
    },
    'DepreciationProfiles': {
        name: 'DepreciationProfiles',
        displayName: 'Depreciation Profiles',
        module: 'Fixed Assets',
        odataCollection: 'AssetDepreciationProfile',
        description: 'Asset depreciation method setup'
    },
    'AssetParameters': {
        name: 'AssetParameters',
        displayName: 'Fixed Asset Parameters',
        module: 'Fixed Assets',
        odataCollection: 'AssetParameters',
        description: 'Fixed assets module parameters'
    },
    'AssetConvention': {
        name: 'AssetConvention',
        displayName: 'Asset Conventions',
        module: 'Fixed Assets',
        odataCollection: 'AssetConvention',
        description: 'Asset calculation convention setup'
    },
    'AssetValueModels': {
        name: 'AssetValueModels',
        displayName: 'Asset Value Models',
        module: 'Fixed Assets',
        odataCollection: 'AssetModel',
        description: 'Asset valuation model setup'
    },
    'AssetTransactionTypes': {
        name: 'AssetTransactionTypes',
        displayName: 'Asset Transaction Types',
        module: 'Fixed Assets',
        odataCollection: 'AssetTransType',
        description: 'Asset transaction type configuration'
    },

    // ===== CASH MANAGEMENT (7 entities) =====
    'BankAccountParameters': {
        name: 'BankAccountParameters',
        displayName: 'Bank Account Parameters',
        module: 'Cash Management',
        odataCollection: 'BankParameters',
        description: 'Bank module parameters'
    },
    'PaymentMethods': {
        name: 'PaymentMethods',
        displayName: 'Payment Methods',
        module: 'Cash Management',
        odataCollection: 'CustVendPaymMode',
        description: 'Payment method setup'
    },
    'BankAccounts': {
        name: 'BankAccounts',
        displayName: 'Bank Accounts',
        module: 'Cash Management',
        odataCollection: 'BankAccountTable',
        description: 'Bank account configuration'
    },
    'CurrencyExchangeRates': {
        name: 'CurrencyExchangeRates',
        displayName: 'Currency Exchange Rates',
        module: 'Cash Management',
        odataCollection: 'ExchangeRateTable',
        description: 'Currency exchange rate setup'
    },
    'BankLCTypes': {
        name: 'BankLCTypes',
        displayName: 'LC and LG Types',
        module: 'Cash Management',
        odataCollection: 'BankLCType',
        description: 'Letter of credit setup'
    },
    'CashFlowForecast': {
        name: 'CashFlowForecast',
        displayName: 'Cash Flow Forecasting',
        module: 'Cash Management',
        odataCollection: 'LedgerCashFlowForecast',
        description: 'Cash flow forecast configuration'
    },
    'SettlementPriorities': {
        name: 'SettlementPriorities',
        displayName: 'Settlement Priorities',
        module: 'Cash Management',
        odataCollection: 'CustVendSettlePriority',
        description: 'Settlement priority rules'
    },

    // ===== HUMAN RESOURCES (8 entities) =====
    'EmployeeParameters': {
        name: 'EmployeeParameters',
        displayName: 'HR Parameters',
        module: 'Human Resources',
        odataCollection: 'HRMParameters',
        description: 'HR module parameters'
    },
    'PayrollParameters': {
        name: 'PayrollParameters',
        displayName: 'Payroll Parameters',
        module: 'Human Resources',
        odataCollection: 'PayrollParameters',
        description: 'Payroll configuration'
    },
    'JobParameters': {
        name: 'JobParameters',
        displayName: 'Job Setup',
        module: 'Human Resources',
        odataCollection: 'HcmJob',
        description: 'Job positions and titles'
    },
    'CompensationPlans': {
        name: 'CompensationPlans',
        displayName: 'Compensation Plans',
        module: 'Human Resources',
        odataCollection: 'HcmCompensationGrid',
        description: 'Compensation plan setup'
    },
    'EmployeeType': {
        name: 'EmployeeType',
        displayName: 'Employee Types',
        module: 'Human Resources',
        odataCollection: 'HcmEmploymentType',
        description: 'Employment type definitions'
    },
    'PayCycles': {
        name: 'PayCycles',
        displayName: 'Pay Cycles',
        module: 'Human Resources',
        odataCollection: 'PayrollPayCycle',
        description: 'Payroll pay cycle setup'
    },
    'EarningCodes': {
        name: 'EarningCodes',
        displayName: 'Earning Codes',
        module: 'Human Resources',
        odataCollection: 'PayrollEarningCode',
        description: 'Payroll earning code configuration'
    },
    'DeductionCodes': {
        name: 'DeductionCodes',
        displayName: 'Deduction Codes',
        module: 'Human Resources',
        odataCollection: 'PayrollDeductionCode',
        description: 'Payroll deduction code setup'
    },

    // ===== PROCUREMENT (8 entities) =====
    'ProcurementCategories': {
        name: 'ProcurementCategories',
        displayName: 'Procurement Categories',
        module: 'Procurement',
        odataCollection: 'ProcCategoryHierarchy',
        description: 'Procurement category definitions'
    },
    'ProcurementParameters': {
        name: 'ProcurementParameters',
        displayName: 'Procurement Parameters',
        module: 'Procurement',
        odataCollection: 'PurchParameters',
        description: 'Procurement module parameters'
    },
    'VendorCategories': {
        name: 'VendorCategories',
        displayName: 'Vendor Categories',
        module: 'Procurement',
        odataCollection: 'VendCategory',
        description: 'Vendor category setup'
    },
    'ProcurementPolicies': {
        name: 'ProcurementPolicies',
        displayName: 'Procurement Policies',
        module: 'Procurement',
        odataCollection: 'ProcCatalogPolicy',
        description: 'Procurement policy configuration'
    },
    'RFQParameters': {
        name: 'RFQParameters',
        displayName: 'RFQ Setup',
        module: 'Procurement',
        odataCollection: 'PurchRFQType',
        description: 'Request for quotation setup'
    },
    'PurchasingPolicies': {
        name: 'PurchasingPolicies',
        displayName: 'Purchasing Policies',
        module: 'Procurement',
        odataCollection: 'PurchPolicy',
        description: 'Purchasing policy rules'
    },
    'VendorApprovalWorkflow': {
        name: 'VendorApprovalWorkflow',
        displayName: 'Vendor Approval Workflow',
        module: 'Procurement',
        odataCollection: 'VendVendorApprovalWorkflow',
        description: 'Vendor approval process configuration'
    },
    'ProcurementCatalog': {
        name: 'ProcurementCatalog',
        displayName: 'Procurement Catalog',
        module: 'Procurement',
        odataCollection: 'ProcCatalog',
        description: 'Procurement catalog setup'
    },

    // ===== SALES (9 entities) =====
    'SalesParameters': {
        name: 'SalesParameters',
        displayName: 'Sales Parameters',
        module: 'Sales',
        odataCollection: 'SalesParameters',
        description: 'Sales module parameters'
    },
    'SalesOrderParameters': {
        name: 'SalesOrderParameters',
        displayName: 'Sales Order Setup',
        module: 'Sales',
        odataCollection: 'SalesOrderHeader',
        description: 'Sales order configuration'
    },
    'DiscountParameters': {
        name: 'DiscountParameters',
        displayName: 'Discount Parameters',
        module: 'Sales',
        odataCollection: 'TradeAgreement',
        description: 'Sales discount and agreement setup'
    },
    'CustomerPaymentTerms': {
        name: 'CustomerPaymentTerms',
        displayName: 'Customer Payment Terms',
        module: 'Sales',
        odataCollection: 'PaymTerm',
        description: 'Customer payment term definitions'
    },
    'SalesOrderPolicies': {
        name: 'SalesOrderPolicies',
        displayName: 'Sales Order Policies',
        module: 'Sales',
        odataCollection: 'SalesPolicy',
        description: 'Sales order policy configuration'
    },
    'CommissionSalesReps': {
        name: 'CommissionSalesReps',
        displayName: 'Sales Rep Commission',
        module: 'Sales',
        odataCollection: 'SalesRepCommissionGroup',
        description: 'Sales representative commission setup'
    },
    'DeliveryTerms': {
        name: 'DeliveryTerms',
        displayName: 'Delivery Terms',
        module: 'Sales',
        odataCollection: 'DeliveryTerms',
        description: 'Delivery term definitions'
    },
    'ShippingCarriers': {
        name: 'ShippingCarriers',
        displayName: 'Shipping Carriers',
        module: 'Sales',
        odataCollection: 'ShippingCarrierTable',
        description: 'Shipping carrier configuration'
    },
    'PriceGroups': {
        name: 'PriceGroups',
        displayName: 'Price Groups',
        module: 'Sales',
        odataCollection: 'TradeAgreementPriceGroup',
        description: 'Sales price group setup'
    },

    // ===== ORGANIZATION ADMINISTRATION (7 entities) =====
    'LegalEntities': {
        name: 'LegalEntities',
        displayName: 'Legal Entities',
        module: 'Organization Admin',
        odataCollection: 'CompanyInfo',
        description: 'Legal entity definitions'
    },
    'NumberSequenceSetup': {
        name: 'NumberSequenceSetup',
        displayName: 'Number Sequence Setup',
        module: 'Organization Admin',
        odataCollection: 'NumberSequenceTable',
        description: 'Number sequence configuration'
    },
    'OrganizationHierarchies': {
        name: 'OrganizationHierarchies',
        displayName: 'Organization Hierarchies',
        module: 'Organization Admin',
        odataCollection: 'OMOperatingUnit',
        description: 'Organization structure and hierarchy'
    },
    'DataAreas': {
        name: 'DataAreas',
        displayName: 'Data Areas',
        module: 'Organization Admin',
        odataCollection: 'DataArea',
        description: 'Data area/database partition setup'
    },
    'UserSetup': {
        name: 'UserSetup',
        displayName: 'User Setup',
        module: 'Organization Admin',
        odataCollection: 'UserInfo',
        description: 'User account configuration'
    },
    'SecurityRoles': {
        name: 'SecurityRoles',
        displayName: 'Security Roles',
        module: 'Organization Admin',
        odataCollection: 'SecurityRole',
        description: 'Security role definitions'
    },
    'DataManagementFramework': {
        name: 'DataManagementFramework',
        displayName: 'Data Management Setup',
        module: 'Organization Admin',
        odataCollection: 'DMFDefinitionGroup',
        description: 'Data management framework configuration'
    }
};

const ODATA_ENDPOINTS = {
    // General Ledger
    ledgers: '/_odata/v1/Ledgers',
    mainAccounts: '/_odata/v1/MainAccounts',
    dimensionHierarchies: '/_odata/v1/DimensionHierarchies',
    dimensionAttributes: '/_odata/v1/DimensionAttributes',
    ledgerParameters: '/_odata/v1/LedgerParameters',
    taxGroups: '/_odata/v1/TaxGroups',
    taxCodes: '/_odata/v1/TaxCodes',
    exchangeRates: '/_odata/v1/ExchangeRateCurrencyPairs',
    fiscalCalendars: '/_odata/v1/FiscalCalendar',

    // AR/AP
    custPostingProfiles: '/_odata/v1/CustPostingProfiles',
    vendPostingProfiles: '/_odata/v1/VendPostingProfiles',
    inventPostingProfiles: '/_odata/v1/InventPostingProfiles',

    // Company/Admin
    companyInfo: '/_odata/v1/CompanyInfos',
    numberSequences: '/_odata/v1/NumberSequences'
};

const FILTER_OPERATORS = {
    equals: 'eq',
    notEquals: 'ne',
    greaterThan: 'gt',
    lessThan: 'lt',
    greaterThanOrEqual: 'ge',
    lessThanOrEqual: 'le',
    contains: 'contains',
    startsWith: 'startswith',
    endsWith: 'endswith'
};

const ENTITY_RELATIONSHIPS = {
    'Ledgers': ['MainAccounts', 'DimensionHierarchies'],
    'MainAccounts': ['Ledgers'],
    'CustPostingProfiles': ['TaxGroups', 'CustomerGroups'],
    'VendPostingProfiles': ['TaxGroups', 'VendorGroups'],
    'TaxCodes': ['TaxGroups']
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        D365F_MODULES,
        D365F_ENTITIES,
        ODATA_ENDPOINTS,
        FILTER_OPERATORS,
        ENTITY_RELATIONSHIPS
    };
}
