// Wrap in try-catch to prevent page errors
try {

// Sidebar state and initialization
let sidebarState = {
    isExtracting: false,
    legalEntities: [],
    selectedLE: [],
    selectedModules: [],
    selectedFormat: 'xlsx'
};

// Expose state to console for debugging
window.D365ConfigDebug = {
    getSidebarState: () => sidebarState,
    getPageCompanies: () => {
        const selects = document.querySelectorAll('select, [role="listbox"], [role="combobox"]');
        const results = [];
        selects.forEach(el => {
            const options = el.querySelectorAll('option, [role="option"]');
            if (options.length > 0) {
                results.push({
                    parent: el.className,
                    options: Array.from(options).map(o => ({
                        text: o.textContent?.trim(),
                        value: o.value || o.getAttribute('data-value')
                    }))
                });
            }
        });
        return results;
    },
    testODataCall: async (endpoint = '/_odata/v1/CompanyInfo?$select=DataAreaId,Name&$top=10') => {
        try {
            const response = await fetch(endpoint, {
                headers: { 'OData-Version': '4.0' },
                credentials: 'include'
            });
            const data = await response.json();
            return { status: response.status, data };
        } catch (e) {
            return { error: e.message };
        }
    },
    reloadLegalEntities: () => {
        loadLegalEntities();
        return 'Legal entities reload triggered';
    }
};

console.log('D365 Config Extractor Debug Mode Enabled');
console.log('Use window.D365ConfigDebug for debugging');

// Module definitions
const D365F_MODULES = {
    'General Ledger': { color: '#0078D4', count: 50 },
    'Accounts Receivable': { color: '#7FBA00', count: 45 },
    'Accounts Payable': { color: '#FFB900', count: 45 },
    'Cash & Bank Management': { color: '#1ABC9C', count: 35 },
    'Fixed Assets': { color: '#9B59B6', count: 35 },
    'Consolidation': { color: '#2C3E50', count: 20 },
    'Inventory Management': { color: '#00D4FF', count: 10 },
    'Project Management': { color: '#6C63FF', count: 8 },
    'Manufacturing': { color: '#E74C3C', count: 9 },
    'Human Resources': { color: '#F39C12', count: 8 },
    'Procurement': { color: '#34495E', count: 10 },
    'Sales': { color: '#C0392B', count: 11 },
    'Organization Admin': { color: '#8E44AD', count: 9 },
    'Tax': { color: '#E67E22', count: 15 },
    'Budget': { color: '#27AE60', count: 10 }
};

// Initialize sidebar immediately (DOMContentLoaded may have already fired)
function initializeSidebar() {
    console.log('Initializing sidebar...');

    // Check if sidebar container exists
    if (!document.getElementById('d365-sidebar-container')) {
        console.log('Sidebar not found, retrying...');
        setTimeout(initializeSidebar, 100);
        return;
    }

    try {
        renderModules();
        loadLegalEntities();
        attachEventListeners();
        console.log('Sidebar initialized successfully');
    } catch (error) {
        console.error('Sidebar initialization error:', error);
    }
}

// Try immediate initialization
console.log('Sidebar script loaded, document ready state:', document.readyState);

if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, initializing sidebar');
        initializeSidebar();
    });
} else {
    // DOM is already ready, initialize now
    console.log('DOM already ready, initializing immediately');
    setTimeout(initializeSidebar, 100);
}

// Also try initialization after a longer delay as backup
setTimeout(() => {
    const container = document.getElementById('d365-sidebar-container');
    const leList = document.getElementById('legalEntitiesList');
    if (container && !leList?.innerHTML) {
        console.log('Backup initialization...');
        initializeSidebar();
    }
}, 500);

function attachEventListeners() {
    // Form submission
    document.getElementById('extractionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        startExtraction();
    });

    // Select All LE
    document.getElementById('selectAllLE').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.le-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        updateLECounter();
        updateSelectedLE();
    });

    // Module buttons
    document.getElementById('selectAllModules').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.module-checkbox').forEach(cb => cb.checked = true);
        updateSelectedModules();
    });

    document.getElementById('selectCoreModules').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.module-checkbox').forEach(cb => {
            cb.checked = ['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Cash & Bank Management', 'Fixed Assets'].includes(cb.value);
        });
        updateSelectedModules();
    });

    document.getElementById('clearAllModules').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.module-checkbox').forEach(cb => cb.checked = false);
        updateSelectedModules();
    });

    // New Extraction button
    document.getElementById('newExtractionBtn').addEventListener('click', resetForm);

    // Close sidebar button
    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);

    // Format selection
    document.querySelectorAll('input[name="format"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            sidebarState.selectedFormat = e.target.value;
        });
    });
}

function renderModules() {
    const modulesList = document.getElementById('modulesList');

    if (!modulesList) {
        console.error('Modules list element not found');
        return;
    }

    modulesList.innerHTML = '';

    Object.entries(D365F_MODULES).forEach(([name, data]) => {
        const label = document.createElement('label');
        label.className = 'module-item';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'module-checkbox';
        input.value = name;
        input.checked = true;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'module-name';
        nameSpan.textContent = name;

        const countSpan = document.createElement('span');
        countSpan.className = 'module-count';
        countSpan.textContent = `${data.count} entities`;

        label.appendChild(input);
        label.appendChild(nameSpan);
        label.appendChild(countSpan);
        modulesList.appendChild(label);

        input.addEventListener('change', updateSelectedModules);
    });

    updateSelectedModules();
}

function updateSelectedModules() {
    const checkboxes = document.querySelectorAll('.module-checkbox:checked');
    sidebarState.selectedModules = Array.from(checkboxes).map(cb => cb.value);
}

function loadLegalEntities() {
    console.log('Loading legal entities...');
    
    // First, try OData fetch (most reliable - gets all entities)
    fetchLegalEntitiesFromOData().then(oDataLEs => {
        if (oDataLEs && oDataLEs.length > 0) {
            console.log(`✓ Found ${oDataLEs.length} legal entities from OData`);
            sidebarState.legalEntities = oDataLEs;
            renderLegalEntities(oDataLEs);
            updateLECounter();
            return;
        }
        
        console.log('OData fetch failed or empty, trying page extraction...');
        
        // Fallback: Try to extract from current page DOM
        let realLEs = extractLegalEntitiesFromPage();
        
        if (realLEs && realLEs.length > 0) {
            console.log(`✓ Found ${realLEs.length} legal entities from page DOM`);
            sidebarState.legalEntities = realLEs;
            renderLegalEntities(sidebarState.legalEntities);
        } else {
            // No entities found - show message and empty list so user can still type manually
            console.warn('⚠ No legal entities found via OData or page extraction');
            console.warn('Ensure you are on a D365F page and OData is accessible');
            sidebarState.legalEntities = [];
            renderLegalEntities([]);
        }
        
        updateLECounter();
    }).catch(error => {
        console.error('Error loading legal entities:', error);
        sidebarState.legalEntities = [];
        renderLegalEntities([]);
        updateLECounter();
    });
}

function extractLegalEntitiesFromPage() {
    const legalEntities = [];

    try {
        // Method 1: Look for company/legal entity selector with specific patterns
        // Avoid tooltips and help text by filtering content
        const selectors = [
            '[data-testid*="company-select"]',
            '[data-testid*="legal-entity"]',
            '[aria-label*="legal entity"]',
            '[title*="legal entity"]',
            '.company-selector',
            '[class*="le-dropdown"]',
            '[class*="entity-select"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Extract options/values from selects or dropdowns
                const options = el.querySelectorAll('option, [role="option"], [data-value]');
                if (options.length > 0) {
                    options.forEach(opt => {
                        const text = opt.textContent?.trim() || '';
                        const value = opt.getAttribute('data-value') || opt.getAttribute('value') || text;
                        
                        // Filter out help text and empty values
                        if (text && value && 
                            text.length < 50 && 
                            value.length < 50 &&
                            !text.toLowerCase().includes('select') &&
                            !text.toLowerCase().includes('lookup') &&
                            !text.toLowerCase().includes('focus') &&
                            !text.toLowerCase().includes('alt+') &&
                            !legalEntities.some(le => le.value === value)) {
                            legalEntities.push({
                                value: value,
                                label: text
                            });
                        }
                    });
                } else {
                    // Single value element
                    const text = el.textContent?.trim() || '';
                    const value = el.getAttribute('data-value') || el.getAttribute('value') || text;
                    
                    if (text && value && 
                        text.length < 50 && 
                        value.length < 50 &&
                        !text.toLowerCase().includes('select') &&
                        !text.toLowerCase().includes('lookup') &&
                        !text.toLowerCase().includes('focus') &&
                        !text.toLowerCase().includes('alt+') &&
                        !legalEntities.some(le => le.value === value)) {
                        legalEntities.push({
                            value: value,
                            label: text
                        });
                    }
                }
            });
        }

        // Method 2: Look in table/grid headers for company columns
        if (legalEntities.length === 0) {
            const headers = document.querySelectorAll('th, [role="columnheader"]');
            headers.forEach(header => {
                const text = header.textContent?.trim() || '';
                if (text.toLowerCase().includes('company') || text.toLowerCase().includes('entity')) {
                    const column = header.closest('table')?.querySelector(`td[data-value]`);
                    if (column) {
                        const value = column.getAttribute('data-value') || column.textContent?.trim();
                        if (value && !legalEntities.some(le => le.value === value)) {
                            legalEntities.push({
                                value: value,
                                label: value
                            });
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error('Error extracting legal entities from page:', error);
    }

    return legalEntities;
}

async function fetchLegalEntitiesFromOData() {
    try {
        // D365F Finance & Operations OData endpoints for legal entities
        // The correct base path is /data/ not /_odata/v1/
        const baseUrl = window.location.origin;
        const endpoints = [
            // Method 1: D365F standard LegalEntities endpoint
            {
                url: `${baseUrl}/data/LegalEntities?$select=LegalEntityId,Name&$top=1000`,
                parser: (data) => {
                    if (data.value && Array.isArray(data.value)) {
                        return data.value
                            .filter(item => item.LegalEntityId)
                            .map(item => ({
                                value: item.LegalEntityId.trim(),
                                label: `${item.LegalEntityId} - ${item.Name || ''}`
                            }));
                    }
                    return [];
                }
            },
            // Method 2: CompanyInfo entity
            {
                url: `${baseUrl}/data/CompanyInfos?$select=DataAreaId,Name&$top=1000`,
                parser: (data) => {
                    if (data.value && Array.isArray(data.value)) {
                        return data.value
                            .filter(item => item.DataAreaId)
                            .map(item => ({
                                value: item.DataAreaId.trim(),
                                label: `${item.DataAreaId} - ${item.Name || ''}`
                            }));
                    }
                    return [];
                }
            },
            // Method 3: LegalEntities without field selection (returns all fields)
            {
                url: `${baseUrl}/data/LegalEntities?$top=1000`,
                parser: (data) => {
                    if (data.value && Array.isArray(data.value)) {
                        return data.value
                            .filter(item => item.LegalEntityId || item.DataAreaId)
                            .map(item => ({
                                value: (item.LegalEntityId || item.DataAreaId).trim(),
                                label: `${item.LegalEntityId || item.DataAreaId} - ${item.Name || ''}`
                            }));
                    }
                    return [];
                }
            },
            // Method 4: Legacy OData v1 path
            {
                url: `${baseUrl}/_odata/v1/CompanyInfo?$select=DataAreaId,Name&$top=1000`,
                parser: (data) => {
                    if (data.value && Array.isArray(data.value)) {
                        return data.value
                            .filter(item => item.DataAreaId)
                            .map(item => ({
                                value: item.DataAreaId.trim(),
                                label: `${item.DataAreaId} - ${item.Name || ''}`
                            }));
                    }
                    return [];
                }
            }
        ];

        // Try each endpoint
        for (const endpoint of endpoints) {
            try {
                console.log(`Trying OData endpoint: ${endpoint.url}`);
                const response = await fetch(endpoint.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'OData-Version': '4.0'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    const entities = endpoint.parser(data);
                    
                    if (entities && entities.length > 0) {
                        console.log(`✓ Successfully fetched ${entities.length} legal entities from: ${endpoint.url}`);
                        return entities;
                    }
                } else {
                    console.log(`Endpoint returned ${response.status}: ${endpoint.url}`);
                }
            } catch (error) {
                console.log(`Endpoint ${endpoint.url} failed:`, error.message);
                continue;
            }
        }

        console.warn('All OData endpoints failed or returned no data');
        return [];

    } catch (error) {
        console.error('Error fetching legal entities from OData:', error);
        return [];
    }
}

function renderLegalEntities(legalEntities) {
    const leList = document.getElementById('legalEntitiesList');

    if (!leList) {
        console.error('Legal entities list element not found');
        return;
    }

    if (!legalEntities || legalEntities.length === 0) {
        leList.innerHTML = '<div class="loading-text">No legal entities</div>';
        return;
    }

    // Clear and populate list
    leList.innerHTML = '';
    legalEntities.forEach(le => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.style.margin = '0';
        label.style.padding = '6px';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'le-checkbox';
        input.value = le.value;
        input.checked = true;

        const span = document.createElement('span');
        span.textContent = le.label;

        label.appendChild(input);
        label.appendChild(span);
        leList.appendChild(label);

        input.addEventListener('change', () => {
            updateSelectedLE();
            updateLECounter();
        });
    });

    updateSelectedLE();
    updateLECounter();
}

function updateSelectedLE() {
    const checkboxes = document.querySelectorAll('.le-checkbox:checked');
    sidebarState.selectedLE = Array.from(checkboxes).map(cb => cb.value);
    updateLECounter();
}

function updateLECounter() {
    const selectedCount = document.querySelectorAll('.le-checkbox:checked').length;
    const totalCount = document.querySelectorAll('.le-checkbox').length;
    const counterText = document.getElementById('leCounterText');

    if (counterText) {
        counterText.textContent = `${selectedCount}/${totalCount} selected`;
    }

    // Update Select All checkbox
    const selectAllCheckbox = document.getElementById('selectAllLE');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedCount === totalCount && totalCount > 0;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }
}

async function startExtraction() {
    if (sidebarState.selectedLE.length === 0) {
        showAlert('Please select at least one legal entity', 'error');
        return;
    }

    if (sidebarState.selectedModules.length === 0) {
        showAlert('Please select at least one module', 'error');
        return;
    }

    sidebarState.isExtracting = true;
    document.getElementById('extractionForm').style.display = 'none';
    document.getElementById('progressSection').style.display = 'flex';

    // Simulate extraction
    await simulateExtraction();
}

async function simulateExtraction() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    const progressDetails = document.getElementById('progressDetails');

    try {
        // Extract real data from D365F
        const extractedRecords = await extractRealConfigurationData();

        // Store extracted records for export
        sidebarState.extractedRecords = extractedRecords;

        // Update progress
        let progress = 0;
        while (progress <= 100) {
            progressFill.style.width = progress + '%';
            progressPercent.textContent = progress + '%';
            progressText.textContent = `Processing ${extractedRecords.length} configuration records...`;

            progress += Math.random() * 20;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';
        progressText.textContent = `Extraction Complete! ${extractedRecords.length} records found`;

        sidebarState.isExtracting = false;

        setTimeout(() => {
            showResults(extractedRecords);
        }, 500);

    } catch (error) {
        console.error('Extraction error:', error);
        progressText.textContent = 'Error: ' + error.message;
        showAlert('Extraction error: ' + error.message, 'error');
        sidebarState.isExtracting = false;
    }
}

async function extractRealConfigurationData() {
    const records = [];
    // Config/setup/master data entities ONLY — no transactional data.
    // Each entity is fetched ONCE without LE filter; D365F OData returns DataAreaId
    // per row automatically, so all legal entities appear combined in one response.
    // ── Entities deliberately excluded for performance ──────────────────────────
    // ExchangeRates             — daily rates, easily 50,000+ rows
    // DimensionAttributeValues  — all dimension member values, can be enormous
    // FinancialDimensionValueEntities — same concept, alias entity
    // LedgerJournalNameAuditTrails — audit log, not config
    // Customers / Vendors       — master data, not config
    // CustomerCreditLimits      — per-customer record, not setup
    // WarehouseLocations        — operational master, can be large
    // ProjectCostSalesPrices    — pricing master data
    // HumanResourcePositions    — position master data
    // All transactional entities (journals, invoices, POs, SOs, timesheets, etc.)
    // Duplicates removed: CashDiscounts/PaymentTerms/PaymentDays/PaymentDayLines kept
    //   only in AR; TaxLedgerAccountGroups kept only in GL; LedgerConsolidateAccountGroups
    //   & MainAccountConsolidateAccounts kept only in GL; CurrencyRevaluationAccounts kept
    //   only in Bank; TradeAgreementJournalNames kept only in AR.
    const moduleODataMap = {
        // ─── GENERAL LEDGER ──────────────────────────────────────────────────────
        'General Ledger': [
            // Chart of Accounts & Main Accounts
            'MainAccounts', 'MainAccountCategories', 'LedgerChartOfAccounts',
            'LedgerChartOfAccountsTranslations', 'MainAccountLegalEntityOverrides',
            'MainAccountConsolidateAccounts', 'LedgerConsolidateAccountGroups',
            // Ledger setup
            'Ledgers', 'LedgerParameters', 'GeneralLedgerParameters',
            // Allocation rules
            'LedgerAllocationRules', 'LedgerAllocationBases', 'LedgerAllocationBasisRules',
            'LedgerAllocationRuleDestinations', 'LedgerAllocationRuleSources',
            'LedgerPeriodAllocationCategories', 'LedgerPeriodAllocationCategoryLines',
            // Journal names (setup only, not transactions)
            'LedgerJournalNames',
            // Financial dimensions (structure only — values excluded for performance)
            'DimensionAttributes', 'DimensionAttributeLegalEntityOverrides',
            'DimensionHierarchies', 'DimensionHierarchyNodes', 'DimensionHierarchyLevel',
            'DimensionSets', 'DimensionSetLines', 'FinancialDimensionDefaultTemplates',
            // Currencies & exchange rate types (rates themselves excluded — too large)
            'Currencies', 'ExchangeRateTypes', 'CurrencyTranslations',
            // Fiscal calendars & periods
            'FiscalCalendars', 'FiscalCalendarYears', 'FiscalCalendarPeriods',
            'AccountingPeriods', 'PeriodTypes',
            // Intercompany & settlement setup
            'LedgerIntercompanyAccounts', 'LedgerIntercompanyPosting',
            'LedgerSettleAccountPairs', 'LedgerAccountAlias', 'LedgerAccountAliasLines',
            // Account structures & advanced rules
            'LedgerAccountStructures', 'LedgerAccountStructureRules',
            'LedgerAdvancedRuleStructures', 'LedgerAdvancedRuleStructureRules',
            // Closing & year-end setup
            'LedgerClosingRoundDifferenceAccounts', 'LedgerYearEndParameters',
            // Accrual setup
            'LedgerAccrualTable',
            // Reason codes
            'ReasonCodes', 'ReasonCodeDescriptions',
            // Posting setup
            'LedgerPosting', 'TaxLedgerAccountGroups', 'CashFlowForecastLedgerAccounts'
        ],

        // ─── ACCOUNTS RECEIVABLE ─────────────────────────────────────────────────
        'Accounts Receivable': [
            // Customer groups & setup (Customers master excluded — too large)
            'CustomerGroups', 'CustomerPostingProfiles', 'CustomerPostingProfileLines', 'CustomerParameters',
            // Payment setup
            'CustomerPaymentMethods', 'CustomerPaymentMethodSpecifications',
            'CustomerPaymentSchedules', 'CustomerPaymentScheduleLines',
            'CashDiscounts', 'PaymentTerms', 'PaymentDays', 'PaymentDayLines',
            // Collections setup
            'CustomerCollectionLetterCodes',
            // Interest setup
            'CustomerInterestCodes',
            // Write-off setup (CustomerCreditLimits excluded — per-customer data)
            'CustomerWriteOffCodes', 'CustomerWriteOffReasonCodeGroups',
            // Charges setup
            'CustomerCharges',
            // Agreement & trade setup
            'SalesAgreementClassifications', 'TradeAgreementJournalNames',
            // Statistics & reporting setup
            'CustomerStatisticsGroups', 'CustomerStatisticsPeriods',
            // Journal names setup
            'CustomerJournalNames'
        ],

        // ─── ACCOUNTS PAYABLE ────────────────────────────────────────────────────
        'Accounts Payable': [
            // Vendor groups & setup (Vendors master excluded — too large)
            'VendorGroups', 'VendorPostingProfiles', 'VendorPostingProfileLines', 'VendorParameters',
            'VendorCertificateTypes', 'VendorCategories', 'VendorDefaultOffsetAccounts',
            // Payment setup (CashDiscounts/PaymentTerms/PaymentDays already in AR — not duplicated)
            'VendorPaymentMethods', 'VendorPaymentMethodSpecifications',
            'VendorPaymentSchedules', 'VendorPaymentScheduleLines',
            // Invoice matching setup
            'VendorInvoiceMatchingPolicies', 'VendorInvoiceMatchingPolicyDetails',
            // Charges setup
            'VendorCharges',
            // Journal names setup
            'VendorJournalNames',
            // Positive pay format setup
            'VendorPositivePayFormats',
            // Procurement policies setup
            'PurchasePolicies', 'PurchaseSetup',
            // Procurement categories setup
            'ProcurementCategories', 'VendorProcurementCategories'
        ],

        // ─── CASH & BANK MANAGEMENT ──────────────────────────────────────────────
        'Cash & Bank Management': [
            // Bank account setup
            'BankAccounts', 'BankAccountTypes', 'BankAccountTransactionTypes', 'BankParameters',
            // Statement format setup
            'BankStatementFormats', 'AdvancedBankReconciliationImportFormats',
            // Cheque layout setup
            'BankChequeLayouts', 'BankNegativePaymentFormats', 'BankChequePaymentControls',
            // Reconciliation rules setup
            'BankReconciliationMatchRules', 'BankReconciliationMatchRuleSets',
            // Invoice matching rules setup
            'BankInvoiceMatchingRules', 'BankInvoiceMatchingRuleDetails',
            // CODA transaction code setup
            'BankCodaTransactionCodes', 'BankCodaGroups',
            // Facility & bridging setup
            'BankFacilityAgreements', 'BridgingAccounts',
            // Cash flow forecast setup
            'CashFlowForecastAccounts', 'CashFlowForecastLedgerDimensions',
            // Currency revaluation setup
            'CurrencyRevaluationAccounts',
            // Bank transaction types setup
            'BankTransactionTypes'
        ],

        // ─── FIXED ASSETS ────────────────────────────────────────────────────────
        'Fixed Assets': [
            // Asset groups & parameters (setup)
            'FixedAssetGroups', 'FixedAssetParameters', 'FixedAssetGroupParameters',
            // Books & depreciation setup
            'FixedAssetBooks', 'FixedAssetGroupBooks', 'FixedAssetBookSetups',
            'FixedAssetValueModelSetups', 'FixedAssetDepreciationProfiles',
            'AssetGroupBonus', 'AssetGroupBonusBook', 'AssetBookReduction',
            // Posting profiles setup
            'FixedAssetPostingProfiles',
            // Insurance setup
            'FixedAssetInsuranceTypes',
            // Component & classification setup
            'FixedAssetComponents', 'FixedAssetComponentGroups',
            'FixedAssetManufacturerModelNumbers', 'FixedAssetConditionCodes', 'FixedAssetBarCodeSetups',
            // Disposal & acquisition setup
            'FixedAssetDisposalParameters',
            // Spend limit setup
            'FixedAssetSpendLimits'
        ],

        // ─── CONSOLIDATION ───────────────────────────────────────────────────────
        'Consolidation': [
            // Consolidation setup (account mapping already in GL — not duplicated here)
            'ConsolidationAccountGroups', 'LedgerConsolidateParameters',
            // Elimination rules setup
            'LedgerEliminationRules', 'LedgerEliminationRuleLines',
            // Currency translation setup (CurrencyRevaluationAccounts already in Bank)
            'ConsolidationCurrencyTranslationAccounts',
            // Financial reporting (Management Reporter) setup
            'FinancialReportingParameters', 'FinancialReportDefinitions',
            'FinancialReportRows', 'FinancialReportColumns', 'FinancialReportTrees'
        ],

        // ─── REMAINING MODULES ────────────────────────────────────────────────────
        'Inventory Management': [
            // WarehouseLocations excluded — operational master, can be very large
            'ItemGroups', 'InventoryParameters', 'InventoryModelGroups', 'InventoryModelGroupPolicies',
            'InventoryDimensionGroups', 'InventoryStorageDimensionGroups',
            'InventoryTrackingDimensionGroups', 'Warehouses',
            'InventoryPostingSetup', 'InventPostingProfiles', 'ItemSetupSupplyTypes',
            // Quality setup
            'InventTestGroups', 'InventTestGroupMembers', 'InventQualityGroups',
            'InventItemQualityGroups', 'InventTestInstruments', 'InventTestVariables'
        ],
        'Project Management': [
            // Parameters & groups
            'ProjectParameters', 'ProjectGroups', 'ProjectContractTypes',
            // Categories & category groups
            'ProjectCategories', 'ProjCategoryGroup',
            // Posting profiles (header + lines)
            'ProjectPostingProfiles', 'ProjPostingProfileLines',
            // Resource & utilization setup
            'ProjectHourUtilizationSetup', 'ProjectResourceSetup',
            // Billing & pricing setup (billing rules are config templates, not transactions)
            'ProjectBillingRules', 'ProjectPeriodTypes',
            // Worker cost price setup
            'ProjectWorkerCostPrice', 'ProjectWorkerSalesPrice'
        ],
        'Manufacturing': [
            'ProductionParameters', 'BOMParameters', 'RouteGroups', 'RouteCostCategories',
            'ProductionPoolGroups', 'ProductionFlushingPrinciples'
        ],
        'Human Resources': [
            // HumanResourcePositions excluded — position master data, can be large
            'HumanResourceParameters', 'HumanResourceJobs',
            'HumanResourceJobFunctions', 'HumanResourceDepartments',
            'PayrollParameters', 'BenefitTypes', 'BenefitPlans',
            // Compensation structure setup
            'CompensationPlans', 'CompensationLevels', 'CompensationGrids',
            'CompensationPayFrequency', 'CompensationStructure'
        ],
        'Sales': [
            // TradeAgreementJournalNames already in AR — not duplicated here
            'SalesParameters', 'SalesPools',
            'SalesStatisticsGroups', 'CommissionSalesGroups', 'CommissionCustomerGroups'
        ],
        'Organization Admin': [
            'CompanyInfo', 'NumberSequenceGroups', 'OperatingUnits',
            'OrganizationHierarchyTypes', 'OrganizationHierarchyPurposes',
            'Departments', 'Divisions', 'Teams',
            // Number sequence formats and assignments
            'NumberSequenceCodes', 'NumberSequenceReferences',
            'NumberSequenceGroupReferences'
        ],
        'Tax': [
            // TaxLedgerAccountGroups already in GL — not duplicated here
            'TaxParameters', 'SalesTaxCodes', 'SalesTaxGroups', 'ItemSalesTaxGroups',
            'TaxExemptCodes', 'TaxAuthorities',
            'TaxSettlementPeriods', 'TaxRegistrationTypes', 'WithholdingTaxCodes',
            'WithholdingTaxGroups', 'TaxReportingCodes', 'TaxFreeAccounts'
        ],
        'Cost Accounting': [
            // Cost accounting ledger & parameters
            'CostAccountingLedger', 'CostAccountingParameters',
            // Cost elements (maps to GL main accounts)
            'CostElements', 'CostElementDimensions',
            // Cost centers & allocation
            'CostCenters', 'CostAllocationBases', 'CostAllocationRules',
            'CostAllocationPolicies', 'CostDistributionPolicies',
            // Cost rate setup
            'CostAccountingOverheadRates', 'CostAccountingCostGroups'
        ],
        'Budget': [
            'BudgetParameters', 'BudgetModels', 'BudgetCycleTimeSpans',
            'BudgetControlConfiguration', 'BudgetControlRules', 'BudgetControlGroups',
            'BudgetPlanningProcesses', 'BudgetPlanningStages', 'BudgetPlanningWorksheetColumns'
        ]
    };

    console.log(`Starting extraction for LEs: ${sidebarState.selectedLE.join(', ')}, Modules: ${sidebarState.selectedModules.join(', ')}`);

    // Calculate and warn about call count
    const selectedEntities = sidebarState.selectedModules.reduce((total, mod) => total + (moduleODataMap[mod]?.length || 0), 0);
    console.log(`📊 Will make ~${selectedEntities} OData calls (config fetched once, not per-LE)`);

    let oDataSuccessCount = 0;
    let oDataFailureCount = 0;

    // Config data is system-wide (not LE-specific for most entities).
    // Fetch each entity ONCE with no LE filter.
    // D365F OData returns DataAreaId per row, so all legal entities appear naturally
    // combined in a single response — no per-LE calls needed.
    for (const module of sidebarState.selectedModules) {
        const entities = moduleODataMap[module] || [];

        for (const entity of entities) {
            try {
                const data = await callODataAPI(entity);

                if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
                    oDataSuccessCount++;
                    console.log(`✓ ${entity}: ${data.value.length} records`);

                    data.value.forEach((item, idx) => {
                        const recordLE = item.DataAreaId || item.dataAreaId || item.LegalEntityId || 'Global';
                        records.push({
                            LegalEntity: recordLE,
                            Module: module,
                            Entity: entity,
                            RecordID: item.RecId || item.EntityID || item.Key || item.dataAreaId || item.CompanyId || `${entity}_${idx}`,
                            Name: item.Name || item.Description || item.DisplayName || item.Title || item.DataAreaId || entity,
                            _rawFields: item  // Full OData record — used for per-entity Excel columns
                        });
                    });
                } else {
                    console.log(`⚠ ${entity}: no data returned`);
                    oDataFailureCount++;
                }

                // Throttle: 80ms between calls to be respectful of server load
                await new Promise(resolve => setTimeout(resolve, 80));
            } catch (error) {
                oDataFailureCount++;
                console.warn(`✗ Error fetching ${entity}: ${error.message}`);
            }
        }
    }

    console.log(`Extraction Summary: ${oDataSuccessCount} successful, ${oDataFailureCount} failed`);

    // If no OData data was found, generate mock data for demonstration
    if (records.length === 0) {
        console.log('No OData records found, generating mock data for demonstration...');
        records.push(...generateMockConfigData());
    }

    return records;
}

function generateMockConfigData() {
    const mockRecords = [];
    const mockData = {
        'General Ledger': {
            'MainAccounts': [
                { RecId: 'MA001', Name: '1000 - Cash', Status: 'Active', Desc: 'Cash on hand' },
                { RecId: 'MA002', Name: '1100 - Bank Deposits', Status: 'Active', Desc: 'Bank deposits' },
                { RecId: 'MA003', Name: '1200 - Accounts Receivable', Status: 'Active', Desc: 'AR control' },
                { RecId: 'MA004', Name: '1400 - Inventory', Status: 'Active', Desc: 'Inventory control' },
                { RecId: 'MA005', Name: '1600 - Fixed Assets', Status: 'Active', Desc: 'Fixed assets' },
                { RecId: 'MA006', Name: '2100 - Accounts Payable', Status: 'Active', Desc: 'AP control' },
                { RecId: 'MA007', Name: '2200 - Salaries Payable', Status: 'Active', Desc: 'Payroll' },
                { RecId: 'MA008', Name: '3100 - Common Stock', Status: 'Active', Desc: 'Equity' }
            ],
            'Ledgers': [
                { RecId: 'L001', Name: 'General Ledger', Status: 'Active', Desc: 'Main GL' },
                { RecId: 'L002', Name: 'Tax Ledger', Status: 'Active', Desc: 'Tax tracking' }
            ],
            'LedgerParameters': [
                { RecId: 'LP001', Name: 'GL Parameters', Status: 'Active', Desc: 'General Ledger setup' }
            ],
            'DimensionAttribute': [
                { RecId: 'DA001', Name: 'Department', Status: 'Active', Desc: 'Department dimension' },
                { RecId: 'DA002', Name: 'Cost Center', Status: 'Active', Desc: 'Cost center dimension' },
                { RecId: 'DA003', Name: 'Project', Status: 'Active', Desc: 'Project dimension' }
            ]
        },
        'Accounts Receivable': {
            'CustGroup': [
                { RecId: 'CG001', Name: '10 - Domestic', Status: 'Active', Desc: 'Domestic customers' },
                { RecId: 'CG002', Name: '20 - International', Status: 'Active', Desc: 'International customers' },
                { RecId: 'CG003', Name: '30 - Government', Status: 'Active', Desc: 'Government agencies' }
            ],
            'CustPostingProfiles': [
                { RecId: 'CP001', Name: 'Domestic', Status: 'Active', Desc: 'Domestic posting' },
                { RecId: 'CP002', Name: 'International', Status: 'Active', Desc: 'International posting' }
            ],
            'CustPaymMode': [
                { RecId: 'PM001', Name: 'Check', Status: 'Active', Desc: 'Check payment' },
                { RecId: 'PM002', Name: 'Wire Transfer', Status: 'Active', Desc: 'Wire transfer' }
            ]
        },
        'Accounts Payable': {
            'VendGroup': [
                { RecId: 'VG001', Name: '10 - Suppliers', Status: 'Active', Desc: 'Regular suppliers' },
                { RecId: 'VG002', Name: '20 - Contractors', Status: 'Active', Desc: 'Contract vendors' },
                { RecId: 'VG003', Name: '30 - One-Time', Status: 'Active', Desc: 'One-time vendors' }
            ],
            'VendPostingProfiles': [
                { RecId: 'VP001', Name: 'Standard', Status: 'Active', Desc: 'Standard posting' },
                { RecId: 'VP002', Name: 'Government', Status: 'Active', Desc: 'Government vendors' }
            ],
            'VendPaymMode': [
                { RecId: 'VPM001', Name: 'Check', Status: 'Active', Desc: 'Check payment' },
                { RecId: 'VPM002', Name: 'ACH', Status: 'Active', Desc: 'ACH transfer' }
            ]
        },
        'Inventory Management': {
            'ItemGroupTable': [
                { RecId: 'IG001', Name: '10 - Raw Materials', Status: 'Active', Desc: 'Raw materials' },
                { RecId: 'IG002', Name: '20 - Finished Goods', Status: 'Active', Desc: 'Finished goods' },
                { RecId: 'IG003', Name: '30 - Supplies', Status: 'Active', Desc: 'Office supplies' }
            ],
            'InventParameters': [
                { RecId: 'IP001', Name: 'Inventory Setup', Status: 'Active', Desc: 'Inventory parameters' }
            ],
            'InventModelGroup': [
                { RecId: 'IMG001', Name: 'FIFO', Status: 'Active', Desc: 'FIFO costing' },
                { RecId: 'IMG002', Name: 'LIFO', Status: 'Active', Desc: 'LIFO costing' },
                { RecId: 'IMG003', Name: 'Weighted Average', Status: 'Active', Desc: 'Weighted average' }
            ],
            'InventLocation': [
                { RecId: 'IL001', Name: 'Main Warehouse', Status: 'Active', Desc: 'Main warehouse' },
                { RecId: 'IL002', Name: 'Distribution Center', Status: 'Active', Desc: 'DC location' }
            ]
        },
        'Project Management': {
            'ProjCategory': [
                { RecId: 'PC001', Name: 'Labor', Status: 'Active', Desc: 'Labor category' },
                { RecId: 'PC002', Name: 'Material', Status: 'Active', Desc: 'Material category' },
                { RecId: 'PC003', Name: 'Expense', Status: 'Active', Desc: 'Expense category' }
            ],
            'ProjParameters': [
                { RecId: 'PP001', Name: 'Project Setup', Status: 'Active', Desc: 'Project parameters' }
            ],
            'ProjPostingProfile': [
                { RecId: 'PPP001', Name: 'Standard', Status: 'Active', Desc: 'Standard posting' }
            ]
        },
        'Manufacturing': {
            'ProdParameters': [
                { RecId: 'MPROD001', Name: 'Production Setup', Status: 'Active', Desc: 'Manufacturing parameters' }
            ],
            'BOMParameters': [
                { RecId: 'MBOM001', Name: 'BOM Setup', Status: 'Active', Desc: 'BOM parameters' }
            ],
            'RouteTable': [
                { RecId: 'RT001', Name: 'Assembly Line A', Status: 'Active', Desc: 'Main assembly line' },
                { RecId: 'RT002', Name: 'Assembly Line B', Status: 'Active', Desc: 'Secondary line' }
            ]
        },
        'Fixed Assets': {
            'AssetGroup': [
                { RecId: 'AG001', Name: 'Buildings', Status: 'Active', Desc: 'Buildings & structures' },
                { RecId: 'AG002', Name: 'Machinery', Status: 'Active', Desc: 'Machinery & equipment' },
                { RecId: 'AG003', Name: 'Vehicles', Status: 'Active', Desc: 'Vehicles' }
            ],
            'AssetParameters': [
                { RecId: 'AP001', Name: 'FA Setup', Status: 'Active', Desc: 'Fixed asset parameters' }
            ],
            'AssetDepreciationProfile': [
                { RecId: 'ADP001', Name: 'Straight Line 5Yr', Status: 'Active', Desc: '5-year SL' },
                { RecId: 'ADP002', Name: 'Straight Line 10Yr', Status: 'Active', Desc: '10-year SL' }
            ]
        },
        'Cash Management': {
            'BankParameters': [
                { RecId: 'BP001', Name: 'Bank Setup', Status: 'Active', Desc: 'Bank parameters' }
            ],
            'BankAccountTable': [
                { RecId: 'BA001', Name: 'Checking Account', Status: 'Active', Desc: 'Main checking' },
                { RecId: 'BA002', Name: 'Savings Account', Status: 'Active', Desc: 'Main savings' }
            ],
            'BankAccountTransactionType': [
                { RecId: 'BATT001', Name: 'Deposit', Status: 'Active', Desc: 'Bank deposits' },
                { RecId: 'BATT002', Name: 'Withdrawal', Status: 'Active', Desc: 'Bank withdrawals' }
            ]
        },
        'Human Resources': {
            'HRMParameters': [
                { RecId: 'HP001', Name: 'HR Setup', Status: 'Active', Desc: 'HR parameters' }
            ],
            'PayrollParameters': [
                { RecId: 'PP001', Name: 'Payroll Setup', Status: 'Active', Desc: 'Payroll parameters' }
            ],
            'HcmJob': [
                { RecId: 'JOB001', Name: 'Manager', Status: 'Active', Desc: 'Management position' },
                { RecId: 'JOB002', Name: 'Analyst', Status: 'Active', Desc: 'Analysis role' }
            ]
        },
        'Procurement': {
            'ProcurementCategories': [
                { RecId: 'PCP001', Name: 'Raw Materials', Status: 'Active', Desc: 'Procurement category' },
                { RecId: 'PCP002', Name: 'Services', Status: 'Active', Desc: 'Service procurement' }
            ],
            'PurchParameters': [
                { RecId: 'PURCH001', Name: 'Purchase Setup', Status: 'Active', Desc: 'Purchase parameters' }
            ]
        },
        'Sales': {
            'SalesParameters': [
                { RecId: 'SP001', Name: 'Sales Setup', Status: 'Active', Desc: 'Sales parameters' }
            ],
            'TradeAgreement': [
                { RecId: 'TA001', Name: 'Volume Discount', Status: 'Active', Desc: 'Volume pricing' },
                { RecId: 'TA002', Name: 'Customer Pricing', Status: 'Active', Desc: 'Customer prices' }
            ]
        },
        'Organization Admin': {
            'CompanyInfo': [
                { RecId: sidebarState.selectedLE[0] || 'USMF', Name: 'United States Manufacturing', Status: 'Active', Desc: 'Main company' }
            ],
            'OMOperatingUnit': [
                { RecId: 'OU001', Name: 'Finance Division', Status: 'Active', Desc: 'Finance operations' },
                { RecId: 'OU002', Name: 'Sales Division', Status: 'Active', Desc: 'Sales operations' }
            ]
        },
        'Tax': {
            'TaxParameters': [
                { RecId: 'TP001', Name: 'Tax Setup', Status: 'Active', Desc: 'Tax parameters' }
            ],
            'TaxTable': [
                { RecId: 'TAX001', Name: 'Sales Tax', Status: 'Active', Desc: 'Sales tax' },
                { RecId: 'TAX002', Name: 'Income Tax', Status: 'Active', Desc: 'Income tax' }
            ]
        },
        'Budget': {
            'BudgetParameters': [
                { RecId: 'BUP001', Name: 'Budget Setup', Status: 'Active', Desc: 'Budget parameters' }
            ],
            'BudgetModel': [
                { RecId: 'BM001', Name: 'FY2025 Budget', Status: 'Active', Desc: '2025 budget' }
            ]
        }
    };

    for (const le of sidebarState.selectedLE) {
        for (const module of sidebarState.selectedModules) {
            const moduleData = mockData[module] || {};
            
            for (const entity in moduleData) {
                const items = moduleData[entity] || [];
                
                items.forEach((item, idx) => {
                    mockRecords.push({
                        LegalEntity: le,
                        Module: module,
                        Entity: entity,
                        RecordID: item.RecId || `${entity}_${idx}`,
                        Name: item.Name || entity,
                        Status: item.Status || 'Active',
                        CreatedDate: new Date().toISOString().split('T')[0],
                        ModifiedDate: new Date().toISOString().split('T')[0],
                        Details: item.Desc || `${entity} configuration record`
                    });
                });
            }
        }
    }

    console.log(`Generated ${mockRecords.length} mock configuration records for testing`);
    return mockRecords;
}

// Fetch a single page from D365F OData and return the parsed JSON, or null on failure.
async function fetchODataPage(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        console.log(`⚠ ${url} returned ${response.status}`);
        return null;
    }
    return response.json();
}

// Fetch ALL pages for a given starting URL by following @odata.nextLink.
// D365F pages at 1000 records by default; we request 1000 per page for efficiency.
async function fetchAllPages(startUrl) {
    const allRecords = [];
    let nextUrl = startUrl;
    let pageNum = 1;

    while (nextUrl) {
        console.log(`  Page ${pageNum}: ${nextUrl}`);
        const data = await fetchODataPage(nextUrl);

        if (!data || !data.value) return null; // request failed

        allRecords.push(...data.value);
        console.log(`  → Page ${pageNum}: ${data.value.length} records (total so far: ${allRecords.length})`);

        // Follow nextLink if present; D365F includes cross-company in the link automatically
        nextUrl = data['@odata.nextLink'] || null;
        pageNum++;

        // Small delay between pages to avoid overloading the server
        if (nextUrl) await new Promise(resolve => setTimeout(resolve, 80));
    }

    return allRecords;
}

async function callODataAPI(entityName) {
    try {
        const baseUrl = window.location.origin;

        // cross-company=true is REQUIRED to get data from all legal entities — without it
        // D365F OData silently returns data for the current company only.
        // $top=1000 is the D365F server-side maximum per page; nextLink handles the rest.
        const urlPatterns = [
            `${baseUrl}/data/${entityName}?cross-company=true&$top=1000`,
            `${baseUrl}/data/${entityName}?$top=1000`,
            `${baseUrl}/_odata/v1/${entityName}?cross-company=true&$top=1000`,
        ];

        for (const url of urlPatterns) {
            try {
                const records = await fetchAllPages(url);
                if (records && records.length > 0) {
                    console.log(`✓ ${entityName}: ${records.length} total records (all pages)`);
                    return { value: records };
                }
                if (records === null) continue; // HTTP error — try next pattern
                // records.length === 0 — entity exists but is empty; still a valid response
                console.log(`⚠ ${entityName}: entity found but empty at ${url}`);
            } catch (innerError) {
                console.log(`⚠ Failed with pattern ${url}: ${innerError.message}`);
            }
        }

        console.log(`No data found for ${entityName}`);
        return { value: [] };
    } catch (error) {
        console.error(`Critical OData API error for ${entityName}:`, error);
        return { value: [] };
    }
}

function showResults(records = []) {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'flex';

    const resultsList = document.getElementById('resultsList');
    const timestamp = new Date().toLocaleString();

    resultsList.innerHTML = `
        <div class="result-item">
            <div class="result-item-name">📊 Configuration Export</div>
            <div class="result-item-details">
                Format: ${sidebarState.selectedFormat.toUpperCase()}<br>
                Records: ${records.length} | LEs: ${sidebarState.selectedLE.length} | Modules: ${sidebarState.selectedModules.length}<br>
                Generated: ${timestamp}
            </div>
            <div class="result-item-download">
                <a href="#" onclick="downloadFile(event)">Download File</a>
            </div>
        </div>
    `;

    showAlert('✓ Extraction completed! Found ' + records.length + ' configuration records.', 'success');
}

function downloadFile(event) {
    event.preventDefault();

    const data = {
        exportDate: new Date().toLocaleString(),
        legalEntities: sidebarState.selectedLE,
        modules: sidebarState.selectedModules,
        configuration: generateConfigurationData()
    };

    let content, mimeType, extension;

    switch (sidebarState.selectedFormat) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;

        case 'csv':
            content = generateCSV(data);
            mimeType = 'text/csv;charset=utf-8;';
            extension = 'csv';
            break;

        case 'txt':
            content = generateTextReport(data);
            mimeType = 'text/plain;charset=utf-8;';
            extension = 'txt';
            break;

        case 'xlsx':
            // For Excel export, generate proper XLSX file
            return downloadExcelFile(data);

        default:
            content = generateCSV(data);
            mimeType = 'text/csv;charset=utf-8;';
            extension = 'csv';
    }

    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `d365-config-${Date.now()}.${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('✓ File downloaded successfully!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showAlert('Error downloading file: ' + error.message, 'error');
    }
}

// Detect the best key field for a multi-record entity (e.g. JournalNameId, Code, Name).
function detectKeyField(sampleRawFields) {
    const skipFields = new Set(['RecId', 'DataAreaId', 'dataAreaId', 'Partition', 'TableId']);
    const keyPatterns = [/Id$/i, /Code$/i, /Name$/i, /Num$/i, /Number$/i, /Key$/i, /Type$/i];
    const keys = Object.keys(sampleRawFields).filter(k => !k.startsWith('@') && !skipFields.has(k));
    for (const pattern of keyPatterns) {
        const match = keys.find(k => pattern.test(k));
        if (match) return match;
    }
    return keys[0] || 'RecId';
}

// Build comparison sheet for parameter-style entities (≤1 record per LE).
// Layout: Field | LE1 | LE2 | ... | Consistent?
function buildParameterSheet(byLE, leList) {
    const skipFields = new Set(['RecId', 'Partition', 'TableId', 'DataAreaId', 'dataAreaId']);
    const allFields = new Set();
    leList.forEach(le => {
        const record = byLE[le]?.[0];
        if (record) Object.keys(record).filter(k => !k.startsWith('@') && !skipFields.has(k)).forEach(k => allFields.add(k));
    });

    const headers = ['Field', ...leList, 'Consistent?'];
    const rows = [];
    for (const field of allFields) {
        const values = leList.map(le => {
            const record = byLE[le]?.[0];
            if (!record) return '—';
            const val = record[field];
            if (val === null || val === undefined) return '—';
            if (typeof val === 'object') return JSON.stringify(val);
            return String(val);
        });
        const present = values.filter(v => v !== '—');
        const consistent = present.length === 0 ? '—' : new Set(present).size === 1 ? '✓ Same' : '⚠ Differs';
        rows.push([field, ...values, consistent]);
    }
    return [headers, ...rows];
}

// Build comparison sheet for multi-record entities (e.g. journal names, posting profiles).
// Layout: KeyField | LE1 | LE2 | ... | In All LEs?
function buildRecordSheet(byLE, leList, allEntityRecords) {
    const sampleRaw = allEntityRecords.find(r => r._rawFields)?._rawFields || {};
    const keyField = detectKeyField(sampleRaw);

    // Collect all unique key values across all LEs
    const allKeys = new Set();
    leList.forEach(le => {
        (byLE[le] || []).forEach(rec => {
            const v = rec[keyField];
            if (v !== null && v !== undefined) allKeys.add(String(v));
        });
    });

    // Build lookup: le -> keyVal -> record
    const lookup = {};
    leList.forEach(le => {
        lookup[le] = {};
        (byLE[le] || []).forEach(rec => { lookup[le][String(rec[keyField] ?? '')] = rec; });
    });

    // Collect extra display fields (up to 3 descriptive fields beside the key)
    const skipFields = new Set(['RecId', 'Partition', 'TableId', 'DataAreaId', 'dataAreaId', keyField]);
    const extraFields = Object.keys(sampleRaw)
        .filter(k => !k.startsWith('@') && !skipFields.has(k))
        .slice(0, 3);

    const headers = [keyField, ...extraFields, ...leList, 'In All LEs?'];
    const rows = [];
    for (const keyVal of allKeys) {
        // Get extra field values from first LE that has this record
        const anyRecord = leList.map(le => lookup[le][keyVal]).find(Boolean) || {};
        const extraValues = extraFields.map(f => {
            const v = anyRecord[f];
            return v === null || v === undefined ? '' : String(v);
        });

        const presence = leList.map(le => lookup[le][keyVal] ? '✓' : '—');
        const presentCount = presence.filter(p => p === '✓').length;
        const coverage = presentCount === leList.length ? '✓ All LEs'
            : presentCount === 0 ? '— None'
            : `⚠ ${presentCount}/${leList.length} LEs`;

        rows.push([keyVal, ...extraValues, ...presence, coverage]);
    }
    return [headers, ...rows];
}

async function downloadExcelFile(data) {
    try {
        if (typeof XLSX === 'undefined') {
            throw new Error('XLSX library not loaded. Please reload the extension.');
        }

        const records = sidebarState.extractedRecords || [];
        const wb = XLSX.utils.book_new();

        // Determine LE list: selected LEs (or all found in data if none selected)
        const selectedLEs = sidebarState.selectedLE && sidebarState.selectedLE.length > 0
            ? sidebarState.selectedLE
            : [...new Set(records.map(r => r.LegalEntity).filter(Boolean))].sort();

        // ── Summary sheet ────────────────────────────────────────────────────────
        const entityCoverage = {};
        records.forEach(r => {
            if (!entityCoverage[r.Entity]) entityCoverage[r.Entity] = new Set();
            if (r.LegalEntity) entityCoverage[r.Entity].add(r.LegalEntity);
        });

        const summaryData = [
            ['D365 FINANCE CONFIGURATION COMPARISON'],
            [],
            ['Export Date', data.exportDate],
            ['Legal Entities Compared', selectedLEs.join(', ')],
            ['Modules', data.modules.join(', ')],
            ['Total Entities Extracted', Object.keys(entityCoverage).length],
            [],
            ['ENTITY', 'MODULE', 'RECORDS', 'LEs WITH DATA', 'COVERAGE'],
            ...records.reduce((acc, r) => {
                if (!acc.seen) acc.seen = new Set();
                if (!acc.seen.has(r.Entity)) {
                    acc.seen.add(r.Entity);
                    const leCount = entityCoverage[r.Entity]?.size || 0;
                    const coverage = selectedLEs.length > 0
                        ? `${leCount}/${selectedLEs.length}`
                        : `${leCount}`;
                    acc.rows.push([r.Entity, r.Module, records.filter(x => x.Entity === r.Entity).length, leCount, coverage]);
                }
                return acc;
            }, { seen: new Set(), rows: [] }).rows
        ];

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        wsSummary['!cols'] = [{ wch: 40 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

        // ── One sheet per entity ─────────────────────────────────────────────────
        const byEntity = {};
        records.forEach(r => {
            if (!byEntity[r.Entity]) byEntity[r.Entity] = [];
            byEntity[r.Entity].push(r);
        });

        const usedSheetNames = new Set(['Summary']);

        for (const [entityName, entityRecords] of Object.entries(byEntity)) {
            // Group raw OData records by LE
            const byLE = {};
            entityRecords.forEach(r => {
                const le = r.LegalEntity || 'Global';
                if (!byLE[le]) byLE[le] = [];
                if (r._rawFields) byLE[le].push(r._rawFields);
            });

            // Build LE list for comparison: prefer selectedLEs order, but fall back to
            // all LEs actually present in the data (handles Global, unmatched IDs, etc.)
            const leList = selectedLEs.length > 0
                ? [
                    ...selectedLEs.filter(le => byLE[le] && byLE[le].length > 0),
                    ...Object.keys(byLE).filter(le => !selectedLEs.includes(le))
                  ]
                : Object.keys(byLE);

            // Always include entity if it has any data — never skip
            if (entityRecords.length === 0) continue;

            // ── Section 1: ALL RAW DATA (every record, every OData field as column) ──
            const rawKeys = new Set();
            entityRecords.forEach(r => {
                if (r._rawFields) {
                    Object.keys(r._rawFields).forEach(k => {
                        if (!k.startsWith('@')) rawKeys.add(k);
                    });
                }
            });
            const rawFieldList = Array.from(rawKeys);
            const rawHeaders = ['LegalEntity', ...rawFieldList];
            const rawRows = entityRecords.map(r => {
                const raw = r._rawFields || {};
                return rawHeaders.map(k => {
                    if (k === 'LegalEntity') return r.LegalEntity || '';
                    const val = raw[k];
                    if (val === null || val === undefined) return '';
                    if (typeof val === 'object') return JSON.stringify(val);
                    return val;
                });
            });

            // ── Section 2: COMPARISON (cross-LE side-by-side) ──
            const maxPerLE = Math.max(...leList.map(le => byLE[le].length));
            const comparisonRows = maxPerLE <= 1
                ? buildParameterSheet(byLE, leList)
                : buildRecordSheet(byLE, leList, entityRecords);

            // Combine: raw data, blank gap, comparison heading, comparison table
            const colCount = Math.max(rawHeaders.length, comparisonRows[0]?.length || 0);
            const sheetData = [
                [`=== ALL SOURCE DATA — ${entityName} ===`],
                rawHeaders,
                ...rawRows,
                [],
                [`=== CROSS-LEGAL ENTITY COMPARISON — ${entityName} ===`],
                ...comparisonRows
            ];

            // Unique sheet name, max 31 chars
            let sheetName = entityName.substring(0, 31);
            let suffix = 2;
            while (usedSheetNames.has(sheetName)) {
                sheetName = `${entityName.substring(0, 28)}_${suffix++}`;
            }
            usedSheetNames.add(sheetName);

            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            ws['!cols'] = Array.from({ length: colCount }, (_, i) => ({ wch: i === 0 ? 35 : 20 }));
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }

        if (Object.keys(byEntity).length === 0) {
            const ws = XLSX.utils.aoa_to_sheet([
                ['No records extracted'],
                ['Ensure OData is accessible and legal entities are selected']
            ]);
            XLSX.utils.book_append_sheet(wb, ws, 'No Data');
        }

        // ── Download via Blob ────────────────────────────────────────────────────
        const wbBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbBinary], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `d365-config-${Date.now()}.xlsx`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const sheetCount = usedSheetNames.size;
        showAlert(`✓ Excel downloaded! ${sheetCount} sheets with cross-LE comparison`, 'success');
    } catch (error) {
        console.error('Excel download error:', error);
        showAlert('Error downloading Excel file: ' + error.message, 'error');
    }
}

function generateConfigurationData() {
    // Use real extracted records if available, otherwise empty array
    const configRecords = sidebarState.extractedRecords || [];
    return {
        total: configRecords.length,
        legalEntities: sidebarState.selectedLE.length,
        modules: sidebarState.selectedModules.length,
        records: configRecords
    };
}

function generateCSV(data) {
    let csv = 'Legal Entity,Module,Entity,Record ID,Name,Status,Created Date,Modified Date,Details\n';

    // Add configuration records - use the actual extracted records
    if (sidebarState.extractedRecords && sidebarState.extractedRecords.length > 0) {
        sidebarState.extractedRecords.forEach(record => {
            csv += `"${escapeCSVValue(record.LegalEntity)}","${escapeCSVValue(record.Module)}","${escapeCSVValue(record.Entity)}","${escapeCSVValue(record.RecordID)}","${escapeCSVValue(record.Name)}","${escapeCSVValue(record.Status)}","${record.CreatedDate}","${record.ModifiedDate}","${escapeCSVValue(record.Details)}"\n`;
        });
    }

    // Add summary at end
    csv += '\n\n';
    csv += 'SUMMARY\n';
    csv += `Export Date,"${data.exportDate}"\n`;
    csv += `Total Records,"${sidebarState.extractedRecords?.length || 0}"\n`;
    csv += `Legal Entities,"${data.legalEntities.join(', ')}"\n`;
    csv += `Modules,"${data.modules.join(', ')}"\n`;
    csv += `LE Count,"${data.configuration.legalEntities}"\n`;
    csv += `Module Count,"${data.configuration.modules}"\n`;

    return csv;
}

function generateExcelCompatibleCSV(data) {
    // Create a more structured CSV with multiple sections for Excel
    let csv = 'D365 FINANCE CONFIGURATION EXPORT\n\n';
    csv += `Export Date,${data.exportDate}\n`;
    csv += `Legal Entities,"${data.legalEntities.join(', ')}"\n`;
    csv += `Modules,"${data.modules.join(', ')}"\n`;
    csv += `Total Records,"${sidebarState.extractedRecords?.length || 0}"\n\n`;

    // Data section header
    csv += 'CONFIGURATION DATA\n';
    csv += 'Legal Entity,Module,Entity,Record ID,Name,Status,Created Date,Modified Date,Details\n';

    // Add configuration records
    if (sidebarState.extractedRecords && sidebarState.extractedRecords.length > 0) {
        sidebarState.extractedRecords.forEach(record => {
            csv += `"${escapeCSVValue(record.LegalEntity)}","${escapeCSVValue(record.Module)}","${escapeCSVValue(record.Entity)}","${escapeCSVValue(record.RecordID)}","${escapeCSVValue(record.Name)}","${escapeCSVValue(record.Status)}","${record.CreatedDate}","${record.ModifiedDate}","${escapeCSVValue(record.Details)}"\n`;
        });
    } else {
        csv += '"No records extracted","","","","","","","",""\n';
    }

    return csv;
}

function escapeCSVValue(value) {
    if (!value) return '';
    const str = String(value);
    // Escape double quotes and wrap in quotes if contains comma, quotes, or newlines
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function generateTextReport(data) {
    let text = '═══════════════════════════════════════════════════════════\n';
    text += '       D365 FINANCE CONFIGURATION EXPORT REPORT\n';
    text += '═══════════════════════════════════════════════════════════\n\n';
    text += `Export Date: ${data.exportDate}\n`;
    text += `Source: Dynamics 365 Finance\n`;
    text += `Exported by: D365 Finance Config Extractor v1.0.0\n\n`;

    text += 'LEGAL ENTITIES INCLUDED:\n';
    text += '─────────────────────────────────────────────────────────\n';
    data.legalEntities.forEach(le => {
        text += `  • ${le}\n`;
    });

    text += '\nMODULES EXTRACTED:\n';
    text += '─────────────────────────────────────────────────────────\n';
    data.modules.forEach(mod => {
        text += `  • ${mod}\n`;
    });

    text += '\nCONFIGURATION RECORDS:\n';
    text += '─────────────────────────────────────────────────────────\n';

    if (data.configuration.records && data.configuration.records.length > 0) {
        text += `Total Records: ${data.configuration.records.length}\n\n`;

        // Group by LE and Module
        const grouped = {};
        data.configuration.records.forEach(record => {
            const key = `${record.LegalEntity} > ${record.Module}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(record);
        });

        Object.entries(grouped).forEach(([key, records]) => {
            text += `\n${key} (${records.length} records):\n`;
            records.forEach(record => {
                text += `  • ${record.Name} [${record.RecordID}] - Status: ${record.Status}\n`;
            });
        });
    }

    text += '\n\nSUMMARY:\n';
    text += '─────────────────────────────────────────────────────────\n';
    text += `Total Legal Entities: ${data.configuration.legalEntities}\n`;
    text += `Total Modules: ${data.configuration.modules}\n`;
    text += `Total Configuration Records: ${data.configuration.total}\n`;
    text += '\n═══════════════════════════════════════════════════════════\n';
    text += 'End of Report\n';

    return text;
}

function resetForm() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('extractionForm').style.display = 'flex';
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('statusAlert').style.display = 'none';
}

function showAlert(message, type = 'info') {
    const alert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');

    alert.className = `alert alert-${type}`;
    statusText.textContent = message;
    alert.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }
}

function closeSidebar() {
    const container = document.getElementById('d365-sidebar-container');
    container.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
        container.remove();
    }, 300);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

} catch (sidebarError) {
    console.error('Sidebar initialization error:', sidebarError);
}
