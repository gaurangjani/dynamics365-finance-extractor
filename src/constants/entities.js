// Core Dynamics 365 Finance entities for configuration extraction

const D365F_ENTITIES = {
    // General Ledger Setup
    'Ledgers': {
        name: 'Ledgers',
        displayName: 'Ledger Setup',
        category: 'General Ledger',
        odataCollection: 'Ledgers',
        description: 'Legal entity accounting configuration'
    },
    'MainAccounts': {
        name: 'MainAccounts',
        displayName: 'Chart of Accounts',
        category: 'General Ledger',
        odataCollection: 'MainAccounts',
        description: 'Main account definitions and hierarchies'
    },
    'DimensionHierarchies': {
        name: 'DimensionHierarchies',
        displayName: 'Dimension Hierarchies',
        category: 'General Ledger',
        odataCollection: 'DimensionHierarchies',
        description: 'Financial dimension hierarchies'
    },
    'DimensionAttributes': {
        name: 'DimensionAttributes',
        displayName: 'Dimension Attributes',
        category: 'General Ledger',
        odataCollection: 'DimensionAttributes',
        description: 'Financial dimension attribute definitions'
    },
    'LedgerParameters': {
        name: 'LedgerParameters',
        displayName: 'Ledger Parameters',
        category: 'General Ledger',
        odataCollection: 'LedgerParameters',
        description: 'General ledger module parameters'
    },

    // Posting Profiles
    'CustPostingProfiles': {
        name: 'CustPostingProfiles',
        displayName: 'Customer Posting Profiles',
        category: 'Accounts Receivable',
        odataCollection: 'CustPostingProfiles',
        description: 'Customer posting profile setup'
    },
    'VendPostingProfiles': {
        name: 'VendPostingProfiles',
        displayName: 'Vendor Posting Profiles',
        category: 'Accounts Payable',
        odataCollection: 'VendPostingProfiles',
        description: 'Vendor posting profile setup'
    },
    'InventPostingProfiles': {
        name: 'InventPostingProfiles',
        displayName: 'Inventory Posting Profiles',
        category: 'Inventory Management',
        odataCollection: 'InventPostingProfiles',
        description: 'Inventory posting profile setup'
    },

    // Additional Configuration
    'CompanyInfo': {
        name: 'CompanyInfo',
        displayName: 'Legal Entity Information',
        category: 'Organization Administration',
        odataCollection: 'CompanyInfos',
        description: 'Legal entity/company information'
    },
    'TaxGroups': {
        name: 'TaxGroups',
        displayName: 'Sales Tax Groups',
        category: 'General Ledger',
        odataCollection: 'TaxGroups',
        description: 'Sales tax group definitions'
    },
    'TaxCodes': {
        name: 'TaxCodes',
        displayName: 'Sales Tax Codes',
        category: 'General Ledger',
        odataCollection: 'TaxCodes',
        description: 'Sales tax code setup'
    },
    'NumberSequences': {
        name: 'NumberSequences',
        displayName: 'Number Sequences',
        category: 'Organization Administration',
        odataCollection: 'NumberSequences',
        description: 'Number sequence setup'
    }
};

const ODATA_ENDPOINTS = {
    companies: '/_odata/v1/Companies',
    ledgers: '/_odata/v1/Ledgers',
    mainAccounts: '/_odata/v1/MainAccounts',
    dimensionHierarchies: '/_odata/v1/DimensionHierarchies',
    dimensionAttributes: '/_odata/v1/DimensionAttributes',
    ledgerParameters: '/_odata/v1/LedgerParameters',
    custPostingProfiles: '/_odata/v1/CustPostingProfiles',
    vendPostingProfiles: '/_odata/v1/VendPostingProfiles',
    inventPostingProfiles: '/_odata/v1/InventPostingProfiles',
    companyInfo: '/_odata/v1/CompanyInfos',
    taxGroups: '/_odata/v1/TaxGroups',
    taxCodes: '/_odata/v1/TaxCodes',
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
    'CustPostingProfiles': ['TaxGroups'],
    'VendPostingProfiles': ['TaxGroups'],
    'TaxCodes': ['TaxGroups']
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        D365F_ENTITIES,
        ODATA_ENDPOINTS,
        FILTER_OPERATORS,
        ENTITY_RELATIONSHIPS
    };
}
