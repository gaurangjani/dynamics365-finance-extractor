document.addEventListener('DOMContentLoaded', initializePopup);

let extractionState = {
    isExtracting: false,
    legalEntities: [],
    selectedLE: [],
    selectedModules: [],
    selectedEntities: [],
    selectedFormats: []
};

let updateEntitiesTimeout = null;

// Module definitions (imported from entities.js pattern)
const D365F_MODULES = {
    'General Ledger': { color: '#0078D4', count: 13 },
    'Accounts Receivable': { color: '#7FBA00', count: 8 },
    'Accounts Payable': { color: '#FFB900', count: 7 },
    'Inventory Management': { color: '#00D4FF', count: 10 },
    'Project Management': { color: '#6C63FF', count: 8 },
    'Manufacturing': { color: '#E74C3C', count: 9 },
    'Fixed Assets': { color: '#9B59B6', count: 7 },
    'Cash Management': { color: '#1ABC9C', count: 7 },
    'Human Resources': { color: '#F39C12', count: 8 },
    'Procurement': { color: '#34495E', count: 8 },
    'Sales': { color: '#C0392B', count: 9 },
    'Organization Admin': { color: '#8E44AD', count: 7 }
};

async function initializePopup() {
    renderModulesList();
    loadLegalEntities();
    attachEventListeners();
    checkExtractionStatus();
}

function attachEventListeners() {
    document.getElementById('extractionForm').addEventListener('submit', startExtraction);

    // Legal Entities - Select All checkbox
    document.getElementById('selectAllLE').addEventListener('change', (e) => {
        if (e.target.checked) {
            selectAllLegalEntities();
        } else {
            clearAllLegalEntities();
        }
    });

    // Modules
    document.getElementById('selectAllModules').addEventListener('click', (e) => {
        e.preventDefault();
        selectAllModules();
    });
    document.getElementById('selectCoreModules').addEventListener('click', (e) => {
        e.preventDefault();
        selectCoreModules();
    });
    document.getElementById('clearAllModules').addEventListener('click', (e) => {
        e.preventDefault();
        clearAllModules();
    });

    // Entities
    document.getElementById('selectAllEntity').addEventListener('click', (e) => {
        e.preventDefault();
        selectAllEntities();
    });
    document.getElementById('clearAllEntity').addEventListener('click', (e) => {
        e.preventDefault();
        clearAllEntities();
    });

    document.getElementById('cancelBtn').addEventListener('click', cancelExtraction);
    document.getElementById('newExtractionBtn').addEventListener('click', resetForm);
}

function renderModulesList() {
    const modulesList = document.getElementById('modulesList');
    modulesList.innerHTML = Object.entries(D365F_MODULES).map(([name, data]) => `
        <label class="module-item">
            <input type="checkbox" class="module-checkbox" value="${name}" checked>
            <div class="module-label">
                <span class="module-name">${name}</span>
                <span class="module-count">${data.count} entities</span>
            </div>
        </label>
    `).join('');

    // Add change listeners
    modulesList.querySelectorAll('.module-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedModules);
    });

    updateSelectedModules();
}

function updateSelectedModules() {
    const checkboxes = document.querySelectorAll('.module-checkbox:checked');
    extractionState.selectedModules = Array.from(checkboxes).map(cb => cb.value);

    // Debounce to prevent rapid successive updates
    clearTimeout(updateEntitiesTimeout);
    updateEntitiesTimeout = setTimeout(() => {
        updateEntitiesList();
    }, 50);
}

function updateEntitiesList() {
    const entitiesList = document.getElementById('entitiesList');

    if (extractionState.selectedModules.length === 0) {
        entitiesList.innerHTML = '<div class="loading-text">Select at least one module to see entities</div>';
        return;
    }

    // Get entities from the imported ENTITIES constant (will be defined below)
    const D365F_ENTITIES = {
        'Ledgers': { module: 'General Ledger' }, 'MainAccounts': { module: 'General Ledger' },
        'DimensionHierarchies': { module: 'General Ledger' }, 'DimensionAttributes': { module: 'General Ledger' },
        'LedgerParameters': { module: 'General Ledger' }, 'TaxGroups': { module: 'General Ledger' },
        'TaxCodes': { module: 'General Ledger' }, 'TaxItemGroups': { module: 'General Ledger' },
        'ExchangeRateCurrencyPairs': { module: 'General Ledger' }, 'IntercompanyAccounting': { module: 'General Ledger' },
        'CompanyInfo': { module: 'Organization Admin' }, 'NumberSequences': { module: 'Organization Admin' },
        'FiscalCalendars': { module: 'General Ledger' }, 'CustomerGroups': { module: 'Accounts Receivable' },
        'CustPostingProfiles': { module: 'Accounts Receivable' }, 'ARParameters': { module: 'Accounts Receivable' },
        'CustomerPaymentMethods': { module: 'Accounts Receivable' }, 'CustomerDiscountGroups': { module: 'Sales' },
        'SalesAgreements': { module: 'Sales' }, 'RevenueRecognitionRules': { module: 'Accounts Receivable' },
        'CustomerCreditLimits': { module: 'Accounts Receivable' }, 'VendorGroups': { module: 'Accounts Payable' },
        'VendPostingProfiles': { module: 'Accounts Payable' }, 'APParameters': { module: 'Accounts Payable' },
        'VendorPaymentMethods': { module: 'Accounts Payable' }, 'VendorDiscountGroups': { module: 'Procurement' },
        'PurchaseAgreements': { module: 'Procurement' }, 'PaymentTerms': { module: 'Accounts Payable' },
        'ItemGroups': { module: 'Inventory Management' }, 'ItemCategories': { module: 'Inventory Management' },
        'InventoryParameters': { module: 'Inventory Management' }, 'InventPostingGroups': { module: 'Inventory Management' },
        'InventPostingProfiles': { module: 'Inventory Management' }, 'StorageDimensions': { module: 'Inventory Management' },
        'TrackingDimensions': { module: 'Inventory Management' }, 'InventoryCosting': { module: 'Inventory Management' },
        'WarehouseLocationFormats': { module: 'Inventory Management' }, 'InventoryUnitConversions': { module: 'Inventory Management' }
    };

    // Filter entities by selected modules
    const filteredEntities = Object.keys(D365F_ENTITIES).filter(entity =>
        extractionState.selectedModules.includes(D365F_ENTITIES[entity].module)
    );

    if (filteredEntities.length === 0) {
        entitiesList.innerHTML = '<div class="loading-text">No entities in selected modules</div>';
        return;
    }

    entitiesList.innerHTML = filteredEntities.map(entity => `
        <label class="checkbox-item">
            <input type="checkbox" name="entity" value="${entity}" checked>
            <span>${entity}</span>
        </label>
    `).join('');
}

function selectAllModules() {
    document.querySelectorAll('.module-checkbox').forEach(cb => {
        cb.checked = true;
    });
    updateSelectedModules();
}

function selectCoreModules() {
    document.querySelectorAll('.module-checkbox').forEach(cb => {
        cb.checked = ['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Inventory Management'].includes(cb.value);
    });
    updateSelectedModules();
}

function clearAllModules() {
    document.querySelectorAll('.module-checkbox').forEach(cb => {
        cb.checked = false;
    });
    updateSelectedModules();
}

async function loadLegalEntities() {
    const leList = document.getElementById('legalEntitiesList');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        return new Promise((resolve) => {
            chrome.tabs.sendMessage(
                tab.id,
                { action: 'getLegalEntities' },
                (response) => {
                    if (response && response.success && response.data && response.data.length > 0) {
                        extractionState.legalEntities = response.data;
                        renderLegalEntities(response.data);
                    } else {
                        // Use mock data if no real data available
                        const mockData = [
                            { value: 'USPM', label: 'US Primary (USPM)' },
                            { value: 'USMF', label: 'US Manufacturing (USMF)' },
                            { value: 'JPMF', label: 'JP Manufacturing (JPMF)' },
                            { value: 'GBPM', label: 'GB Primary (GBPM)' },
                            { value: 'EUPM', label: 'EU Primary (EUPM)' }
                        ];
                        extractionState.legalEntities = mockData;
                        renderLegalEntities(mockData);
                    }
                    resolve();
                }
            );
        });
    } catch (error) {
        console.error('Error loading legal entities:', error);
        // Fallback to mock data
        const mockData = [
            { value: 'USPM', label: 'US Primary (USPM)' },
            { value: 'USMF', label: 'US Manufacturing (USMF)' },
            { value: 'JPMF', label: 'JP Manufacturing (JPMF)' },
            { value: 'GBPM', label: 'GB Primary (GBPM)' },
            { value: 'EUPM', label: 'EU Primary (EUPM)' }
        ];
        extractionState.legalEntities = mockData;
        renderLegalEntities(mockData);
    }
}

function renderLegalEntities(legalEntities) {
    const leList = document.getElementById('legalEntitiesList');

    if (!legalEntities || legalEntities.length === 0) {
        leList.innerHTML = '<div class="loading-text">No legal entities found</div>';
        return;
    }

    leList.innerHTML = legalEntities.map(le => `
        <label class="checkbox-item" style="margin: 0;">
            <input type="checkbox" class="le-checkbox" value="${le.value}" data-label="${le.label}" checked>
            <span>${le.label}</span>
        </label>
    `).join('');

    // Add change listener to checkboxes
    setTimeout(() => {
        leList.querySelectorAll('.le-checkbox').forEach(checkbox => {
            checkbox.removeEventListener('change', handleLECheckboxChange);
            checkbox.addEventListener('change', handleLECheckboxChange);
        });
        // Update counter
        updateLECounter();
    }, 0);
}

function handleLECheckboxChange() {
    updateSelectedLE();
    updateLECounter();
}

function updateLECounter() {
    const selectedCount = document.querySelectorAll('.le-checkbox:checked').length;
    const totalCount = document.querySelectorAll('.le-checkbox').length;
    const counterText = document.getElementById('leCounterText');

    if (counterText) {
        counterText.textContent = `${selectedCount}/${totalCount} selected`;
    }

    // Update "Select All" checkbox state
    const selectAllCheckbox = document.getElementById('selectAllLE');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedCount === totalCount && totalCount > 0;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }
}

function updateSelectedLE() {
    const checkboxes = document.querySelectorAll('.le-checkbox:checked');
    extractionState.selectedLE = Array.from(checkboxes).map(cb => cb.value);
    updateLECounter();
}

function selectAllLegalEntities() {
    document.querySelectorAll('#legalEntitiesList .le-checkbox').forEach(cb => {
        cb.checked = true;
    });
    updateSelectedLE();
}

function clearAllLegalEntities() {
    document.querySelectorAll('#legalEntitiesList .le-checkbox').forEach(cb => {
        cb.checked = false;
    });
    updateSelectedLE();
}

function selectAllEntities() {
    document.querySelectorAll('input[name="entity"]').forEach(cb => {
        cb.checked = true;
    });
}

function clearAllEntities() {
    document.querySelectorAll('input[name="entity"]').forEach(cb => {
        cb.checked = false;
    });
}

async function startExtraction(event) {
    event.preventDefault();

    extractionState.selectedLE = Array.from(
        document.querySelectorAll('#legalEntitiesList .le-checkbox:checked')
    ).map(cb => cb.value);

    extractionState.selectedEntities = Array.from(
        document.querySelectorAll('input[name="entity"]:checked')
    ).map(cb => cb.value);

    extractionState.selectedFormats = Array.from(
        document.querySelectorAll('input[name="format"]:checked')
    ).map(cb => cb.value);

    const includeComparison = document.getElementById('includeComparison').checked;

    if (extractionState.selectedLE.length === 0) {
        showAlert('Please select at least one legal entity', 'error');
        return;
    }

    if (extractionState.selectedEntities.length === 0) {
        showAlert('Please select at least one entity type', 'error');
        return;
    }

    if (extractionState.selectedFormats.length === 0) {
        showAlert('Please select at least one export format', 'error');
        return;
    }

    extractionState.isExtracting = true;
    document.getElementById('extractionForm').style.display = 'none';
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.getElementById('extractBtn').disabled = true;

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(
            tab.id,
            {
                action: 'startExtraction',
                legalEntities: extractionState.selectedLE,
                entities: extractionState.selectedEntities,
                formats: extractionState.selectedFormats,
                includeComparison: includeComparison
            },
            (response) => {
                if (response && response.success) {
                    showAlert('Extraction started. Processing data...', 'info');
                    pollExtractionStatus();
                } else {
                    extractionState.isExtracting = false;
                    showAlert('Error starting extraction: ' + (response?.error || 'Unknown error'), 'error');
                    resetForm();
                }
            }
        );
    } catch (error) {
        console.error('Error starting extraction:', error);
        extractionState.isExtracting = false;
        showAlert('Error: ' + error.message, 'error');
        resetForm();
    }
}

function pollExtractionStatus() {
    const pollInterval = setInterval(() => {
        chrome.runtime.sendMessage(
            { action: 'getExtractionStatus' },
            (response) => {
                if (response) {
                    updateProgress(response);

                    if (response.complete) {
                        clearInterval(pollInterval);
                        showResults(response.results);
                        extractionState.isExtracting = false;
                    }
                }
            }
        );
    }, 500);
}

function updateProgress(status) {
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    const progressDetails = document.getElementById('progressDetails');

    progressText.textContent = status.message || 'Extracting...';
    progressPercent.textContent = Math.round(status.percentage || 0) + '%';
    progressFill.style.width = (status.percentage || 0) + '%';

    if (status.details && status.details.length > 0) {
        progressDetails.innerHTML = status.details
            .slice(-5)
            .map(d => `<div class="progress-detail-item">✓ ${d}</div>`)
            .join('');
    }
}

function showResults(results) {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('cancelBtn').style.display = 'none';

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    if (!results || results.length === 0) {
        resultsList.innerHTML = '<div class="result-item"><div class="result-item-name">No results</div></div>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-item-name">${result.name}</div>
            <div class="result-item-details">
                <div>Format: ${result.format.toUpperCase()}</div>
                <div>Size: ${formatBytes(result.size)}</div>
                <div>Generated: ${new Date(result.timestamp).toLocaleString()}</div>
            </div>
            <div class="result-item-download">
                <a href="#" data-file-id="${result.fileId}" onclick="downloadFile(event, '${result.fileId}', '${result.filename}')">Download</a>
            </div>
        `;
        resultsList.appendChild(resultItem);
    });

    showAlert('Extraction completed successfully!', 'success');
}

function downloadFile(event, fileId, filename) {
    event.preventDefault();
    chrome.runtime.sendMessage(
        { action: 'downloadFile', fileId: fileId, filename: filename },
        (response) => {
            if (response && response.success) {
                console.log('Download initiated');
            } else {
                showAlert('Download failed', 'error');
            }
        }
    );
}

function cancelExtraction() {
    extractionState.isExtracting = false;
    chrome.runtime.sendMessage({ action: 'cancelExtraction' });
    resetForm();
}

function resetForm() {
    document.getElementById('extractionForm').style.display = 'block';
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('extractBtn').disabled = false;
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('statusAlert').style.display = 'none';
    loadLegalEntities();
}

function checkExtractionStatus() {
    chrome.runtime.sendMessage(
        { action: 'getExtractionStatus' },
        (response) => {
            if (response && response.isExtracting) {
                extractionState.isExtracting = true;
                document.getElementById('extractionForm').style.display = 'none';
                document.getElementById('progressSection').style.display = 'block';
                pollExtractionStatus();
            }
        }
    );
}

function showAlert(message, type = 'info') {
    const alert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');

    alert.className = `alert alert-${type}`;
    statusText.textContent = message;
    alert.style.display = 'block';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
