document.addEventListener('DOMContentLoaded', initializePopup);

let extractionState = {
    isExtracting: false,
    legalEntities: [],
    selectedLE: [],
    selectedEntities: [],
    selectedFormats: []
};

async function initializePopup() {
    loadLegalEntities();
    attachEventListeners();
    checkExtractionStatus();
}

function attachEventListeners() {
    document.getElementById('extractionForm').addEventListener('submit', startExtraction);
    document.getElementById('selectAllLE').addEventListener('click', (e) => {
        e.preventDefault();
        selectAllLegalEntities();
    });
    document.getElementById('clearAllLE').addEventListener('click', (e) => {
        e.preventDefault();
        clearAllLegalEntities();
    });
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

async function loadLegalEntities() {
    const leList = document.getElementById('legalEntitiesList');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(
            tab.id,
            { action: 'getLegalEntities' },
            (response) => {
                if (response && response.success) {
                    extractionState.legalEntities = response.data || [];
                    renderLegalEntities(response.data || []);
                } else {
                    leList.innerHTML = '<div class="loading-text">Could not fetch legal entities. Make sure you are on a D365F page.</div>';
                }
            }
        );
    } catch (error) {
        console.error('Error loading legal entities:', error);
        leList.innerHTML = '<div class="loading-text">Error: Navigate to Dynamics 365 Finance first</div>';
    }
}

function renderLegalEntities(legalEntities) {
    const leList = document.getElementById('legalEntitiesList');

    if (!legalEntities || legalEntities.length === 0) {
        leList.innerHTML = '<div class="loading-text">No legal entities found</div>';
        return;
    }

    leList.innerHTML = legalEntities.map(le => `
        <label class="checkbox-item">
            <input type="checkbox" class="le-checkbox" value="${le.value}" data-label="${le.label}">
            <span>${le.label} (${le.value})</span>
        </label>
    `).join('');

    // Add change listener to checkboxes
    leList.querySelectorAll('.le-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedLE);
    });
}

function updateSelectedLE() {
    const checkboxes = document.querySelectorAll('#legalEntitiesList .le-checkbox:checked');
    extractionState.selectedLE = Array.from(checkboxes).map(cb => cb.value);
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
