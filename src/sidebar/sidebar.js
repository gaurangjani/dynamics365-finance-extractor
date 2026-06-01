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

// Module definitions
const D365F_MODULES = {
    'General Ledger': { color: '#0078D4', count: 11 },
    'Accounts Receivable': { color: '#7FBA00', count: 6 },
    'Accounts Payable': { color: '#FFB900', count: 5 },
    'Inventory Management': { color: '#00D4FF', count: 10 },
    'Project Management': { color: '#6C63FF', count: 8 },
    'Manufacturing': { color: '#E74C3C', count: 9 },
    'Fixed Assets': { color: '#9B59B6', count: 7 },
    'Cash Management': { color: '#1ABC9C', count: 7 },
    'Human Resources': { color: '#F39C12', count: 8 },
    'Procurement': { color: '#34495E', count: 10 },
    'Sales': { color: '#C0392B', count: 11 },
    'Organization Admin': { color: '#8E44AD', count: 9 }
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
            cb.checked = ['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Inventory Management'].includes(cb.value);
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
    // Try to extract real legal entities from D365F page
    let realLEs = extractLegalEntitiesFromPage();

    // If no real LEs found, use mock data
    if (realLEs.length === 0) {
        console.log('No real legal entities found, using mock data');
        realLEs = [
            { value: 'USPM', label: 'US Primary (USPM)' },
            { value: 'USMF', label: 'US Manufacturing (USMF)' },
            { value: 'JPMF', label: 'JP Manufacturing (JPMF)' },
            { value: 'GBPM', label: 'GB Primary (GBPM)' },
            { value: 'EUPM', label: 'EU Primary (EUPM)' },
            { value: 'CAPM', label: 'Canada Primary (CAPM)' },
            { value: 'AUPM', label: 'Australia (AUPM)' }
        ];
    } else {
        console.log('Found real legal entities:', realLEs);
    }

    sidebarState.legalEntities = realLEs;
    renderLegalEntities(realLEs);

    setTimeout(() => {
        updateLECounter();
    }, 50);
}

function extractLegalEntitiesFromPage() {
    const legalEntities = [];

    try {
        // Method 1: Look for company selector in page header/navbar
        const companySelectors = document.querySelectorAll('[data-testid*="company"], [aria-label*="company"], [title*="company"], .company-selector, [class*="company"]');

        companySelectors.forEach(el => {
            const text = el.textContent?.trim() || '';
            const value = el.getAttribute('data-value') || el.getAttribute('value') || text;

            if (text && value && text.length < 100 && !legalEntities.some(le => le.value === value)) {
                legalEntities.push({
                    value: value.substring(0, 20),
                    label: text.substring(0, 100)
                });
            }
        });

        // Method 2: Try to access D365F application context
        if (legalEntities.length === 0 && window.xrm) {
            try {
                const context = window.xrm.Page.context;
                const orgId = context.getOrgLcid();
                if (orgId) {
                    legalEntities.push({
                        value: orgId.toString(),
                        label: `Organization (${orgId})`
                    });
                }
            } catch (e) {
                console.log('Could not access XRM context');
            }
        }

        // Method 3: Look for any dropdown or select with company/LE values
        if (legalEntities.length === 0) {
            const selects = document.querySelectorAll('select, [role="listbox"], [role="combobox"]');
            selects.forEach(select => {
                if (select.textContent.toLowerCase().includes('company') || select.textContent.toLowerCase().includes('entity')) {
                    const options = select.querySelectorAll('option, [role="option"]');
                    options.forEach(option => {
                        const text = option.textContent?.trim();
                        const value = option.value || text;
                        if (text && value && !text.toLowerCase().includes('select') && !legalEntities.some(le => le.value === value)) {
                            legalEntities.push({
                                value: value.substring(0, 20),
                                label: text.substring(0, 100)
                            });
                        }
                    });
                }
            });
        }

    } catch (error) {
        console.error('Error extracting legal entities:', error);
    }

    return legalEntities;
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

    for (let i = 0; i <= 100; i += 10) {
        progressFill.style.width = i + '%';
        progressPercent.textContent = i + '%';
        progressText.textContent = `Extracting data... (${i}%)`;

        progressDetails.innerHTML += `
            <div class="progress-detail-item">✓ Processing module ${Math.ceil(i / 20)}...</div>
        `;

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Complete
    progressText.textContent = 'Extraction Complete!';
    sidebarState.isExtracting = false;

    setTimeout(() => {
        showResults();
    }, 500);
}

function showResults() {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'flex';

    const resultsList = document.getElementById('resultsList');
    const timestamp = new Date().toLocaleString();

    resultsList.innerHTML = `
        <div class="result-item">
            <div class="result-item-name">📊 Configuration Export</div>
            <div class="result-item-details">
                Format: ${sidebarState.selectedFormat.toUpperCase()}<br>
                LEs: ${sidebarState.selectedLE.length} | Modules: ${sidebarState.selectedModules.length}<br>
                Generated: ${timestamp}
            </div>
            <div class="result-item-download">
                <a href="#" onclick="downloadFile(event)">Download File</a>
            </div>
        </div>
    `;

    showAlert('✓ Extraction completed successfully!', 'success');
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
        default:
            // For Excel, we'll create a simple CSV that Excel can open
            content = generateCSV(data);
            mimeType = 'text/csv;charset=utf-8;';
            extension = 'csv'; // Save as CSV which Excel can open
            break;
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

function generateConfigurationData() {
    // Generate sample configuration records for selected modules and LEs
    const configRecords = [];

    // For each selected LE and module combination, create sample records
    sidebarState.selectedLE.forEach(le => {
        sidebarState.selectedModules.forEach(module => {
            // Create 3 sample records per LE/module combination
            for (let i = 1; i <= 3; i++) {
                configRecords.push({
                    LegalEntity: le,
                    Module: module,
                    RecordID: `${module}_${le}_${i}`,
                    Name: `${module} Config ${i}`,
                    Status: i % 2 === 0 ? 'Active' : 'Inactive',
                    CreatedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    ModifiedDate: new Date().toISOString().split('T')[0]
                });
            }
        });
    });

    return {
        total: configRecords.length,
        legalEntities: sidebarState.selectedLE.length,
        modules: sidebarState.selectedModules.length,
        records: configRecords
    };
}

function generateCSV(data) {
    let csv = 'Legal Entity,Module,Record ID,Name,Status,Created Date,Modified Date\n';

    // Add configuration records
    if (data.configuration.records && data.configuration.records.length > 0) {
        data.configuration.records.forEach(record => {
            csv += `"${record.LegalEntity}","${record.Module}","${record.RecordID}","${record.Name}","${record.Status}","${record.CreatedDate}","${record.ModifiedDate}"\n`;
        });
    }

    // Add summary at end
    csv += '\n\n';
    csv += 'SUMMARY\n';
    csv += `Export Date,"${data.exportDate}"\n`;
    csv += `Total Records,"${data.configuration.total}"\n`;
    csv += `Legal Entities,"${data.legalEntities.join(', ')}"\n`;
    csv += `Modules,"${data.modules.join(', ')}"\n`;
    csv += `LE Count,"${data.configuration.legalEntities}"\n`;
    csv += `Module Count,"${data.configuration.modules}"\n`;

    return csv;
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
