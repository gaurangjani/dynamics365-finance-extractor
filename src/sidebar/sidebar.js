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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebar);
} else {
    // DOM is already ready, initialize now
    setTimeout(initializeSidebar, 50);
}

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
    // Mock legal entities - always use these for now
    const mockLEs = [
        { value: 'USPM', label: 'US Primary (USPM)' },
        { value: 'USMF', label: 'US Manufacturing (USMF)' },
        { value: 'JPMF', label: 'JP Manufacturing (JPMF)' },
        { value: 'GBPM', label: 'GB Primary (GBPM)' },
        { value: 'EUPM', label: 'EU Primary (EUPM)' },
        { value: 'CAPM', label: 'Canada Primary (CAPM)' },
        { value: 'AUPM', label: 'Australia (AUPM)' }
    ];

    sidebarState.legalEntities = mockLEs;
    renderLegalEntities(mockLEs);

    // Update counter
    setTimeout(() => {
        updateLECounter();
    }, 50);
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
        legalEntities: sidebarState.selectedLE,
        modules: sidebarState.selectedModules,
        format: sidebarState.selectedFormat,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `d365-config-${Date.now()}.${sidebarState.selectedFormat}`;
    a.click();
    URL.revokeObjectURL(url);
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
