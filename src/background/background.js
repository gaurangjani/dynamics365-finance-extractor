console.log('D365 Finance Extractor background service loaded');

let extractionSession = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received:', request.action);

    switch (request.action) {
        case 'initializeExtraction':
            initializeExtraction(request, sender).then(result => {
                sendResponse({ success: true, result });
            }).catch(error => {
                console.error('Extraction error:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true;

        case 'getExtractionStatus':
            getExtractionStatus().then(status => {
                sendResponse(status);
            });
            return true;

        case 'cancelExtraction':
            cancelExtraction();
            sendResponse({ success: true });
            break;

        case 'downloadFile':
            downloadFile(request.fileId, request.filename);
            sendResponse({ success: true });
            break;

        case 'getExtractedData':
            getExtractedData().then(data => {
                sendResponse({ success: true, data });
            });
            return true;

        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

async function initializeExtraction(request, sender) {
    extractionSession = {
        tabId: sender.tab.id,
        legalEntities: request.legalEntities,
        entities: request.entities,
        formats: request.formats,
        includeComparison: request.includeComparison,
        startTime: Date.now(),
        status: 'initializing',
        progress: 0,
        message: 'Starting extraction...',
        details: [],
        complete: false,
        extractedData: {},
        results: []
    };

    // Start extraction in background
    performExtraction();

    return { success: true, sessionId: extractionSession.id };
}

async function performExtraction() {
    if (!extractionSession) return;

    extractionSession.status = 'extracting';

    const totalLEs = extractionSession.legalEntities.length;
    const totalEntities = extractionSession.entities.length;
    const totalSteps = totalLEs * totalEntities;

    let currentStep = 0;

    try {
        for (const legalEntity of extractionSession.legalEntities) {
            extractionSession.extractedData[legalEntity] = {};

            for (const entity of extractionSession.entities) {
                if (!extractionSession.status === 'active') break;

                currentStep++;
                const percentage = Math.round((currentStep / totalSteps) * 100);

                extractionSession.message = `Extracting ${entity} for ${legalEntity}...`;
                extractionSession.progress = percentage;
                extractionSession.details.push(`Extracted ${entity} from ${legalEntity}`);

                try {
                    const entityData = await extractEntity(legalEntity, entity);
                    extractionSession.extractedData[legalEntity][entity] = entityData;
                } catch (error) {
                    console.error(`Error extracting ${entity} for ${legalEntity}:`, error);
                    extractionSession.details.push(`⚠ Error: ${entity} from ${legalEntity}`);
                }
            }
        }

        // Perform comparison if requested
        if (extractionSession.includeComparison) {
            extractionSession.message = 'Generating comparison report...';
            extractionSession.progress = 95;

            const comparisons = performComparison(extractionSession.extractedData);
            extractionSession.extractedData._comparisons = comparisons;
            extractionSession.details.push('Generated comparison report');
        }

        // Export data in requested formats
        extractionSession.message = 'Exporting data...';
        extractionSession.progress = 97;

        for (const format of extractionSession.formats) {
            try {
                await exportData(format, extractionSession.extractedData);
                extractionSession.details.push(`Exported ${format.toUpperCase()}`);
            } catch (error) {
                console.error(`Error exporting ${format}:`, error);
                extractionSession.details.push(`⚠ Export error: ${format}`);
            }
        }

        extractionSession.status = 'complete';
        extractionSession.progress = 100;
        extractionSession.message = 'Extraction completed successfully!';
        extractionSession.complete = true;

    } catch (error) {
        console.error('Fatal extraction error:', error);
        extractionSession.status = 'error';
        extractionSession.message = 'Error: ' + error.message;
        extractionSession.complete = true;
    }
}

async function extractEntity(legalEntity, entityName) {
    // Simulate OData API call
    // In production, this would call the actual D365F OData API

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                entityName,
                legalEntity,
                count: Math.floor(Math.random() * 100) + 10,
                records: generateMockRecords(entityName)
            });
        }, 500 + Math.random() * 1000);
    });
}

function generateMockRecords(entityName) {
    const count = Math.floor(Math.random() * 20) + 5;
    const records = [];

    for (let i = 0; i < count; i++) {
        const record = {
            id: `ID_${i + 1}`,
            name: `${entityName}_${i + 1}`,
            description: `${entityName} record ${i + 1}`,
            createdDate: new Date().toISOString(),
            status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)]
        };
        records.push(record);
    }

    return records;
}

function performComparison(extractedData) {
    const comparisons = {
        summary: {},
        details: {}
    };

    const legalEntities = Object.keys(extractedData).filter(k => k !== '_comparisons');

    for (const entity of Object.keys(extractedData[legalEntities[0]] || {})) {
        comparisons.details[entity] = {};

        for (let i = 0; i < legalEntities.length - 1; i++) {
            const le1 = legalEntities[i];
            const le2 = legalEntities[i + 1];

            const key = `${le1}_vs_${le2}`;
            const data1 = extractedData[le1][entity] || {};
            const data2 = extractedData[le2][entity] || {};

            comparisons.details[entity][key] = {
                le1Count: data1.count || 0,
                le2Count: data2.count || 0,
                differences: Math.abs((data1.count || 0) - (data2.count || 0)),
                match: data1.count === data2.count
            };
        }
    }

    return comparisons;
}

async function exportData(format, data) {
    const timestamp = new Date().toISOString().split('T')[0];

    let fileContent, fileName, fileType;

    switch (format.toLowerCase()) {
        case 'json':
            fileContent = JSON.stringify(data, null, 2);
            fileName = `d365-config-export-${timestamp}.json`;
            fileType = 'application/json';
            break;

        case 'csv':
            fileContent = convertToCSV(data);
            fileName = `d365-config-export-${timestamp}.csv`;
            fileType = 'text/csv';
            break;

        case 'txt':
            fileContent = convertToText(data);
            fileName = `d365-config-export-${timestamp}.txt`;
            fileType = 'text/plain';
            break;

        case 'xlsx':
            // Excel export will be handled separately
            fileName = `d365-config-export-${timestamp}.xlsx`;
            fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;

        default:
            throw new Error(`Unsupported format: ${format}`);
    }

    // Store file reference
    if (!extractionSession.results) {
        extractionSession.results = [];
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    extractionSession.results.push({
        fileId,
        filename: fileName,
        format,
        size: fileContent?.length || 0,
        timestamp: new Date().toISOString()
    });

    // Store content in chrome storage for download
    const storageKey = `export_${fileId}`;
    const storageData = {};
    storageData[storageKey] = {
        content: fileContent,
        fileName,
        fileType,
        createdAt: new Date().toISOString()
    };

    await chrome.storage.local.set(storageData);
}

function convertToCSV(data) {
    const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');
    let csv = 'LegalEntity,Entity,Record,Field,Value\n';

    for (const le of legalEntities) {
        for (const entity in data[le]) {
            if (data[le][entity] && data[le][entity].records) {
                for (const record of data[le][entity].records) {
                    for (const field in record) {
                        csv += `"${le}","${entity}","${record.id}","${field}","${record[field]}"\n`;
                    }
                }
            }
        }
    }

    return csv;
}

function convertToText(data) {
    let text = '=== D365 Finance Configuration Export ===\n\n';
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `=================================================\n\n`;

    const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

    for (const le of legalEntities) {
        text += `\n[${le}]\n`;
        text += '-'.repeat(50) + '\n\n';

        for (const entity in data[le]) {
            text += `Entity: ${entity}\n`;
            if (data[le][entity] && data[le][entity].records) {
                text += `Records: ${data[le][entity].records.length}\n\n`;

                for (const record of data[le][entity].records) {
                    text += `  Record: ${record.id}\n`;
                    for (const field in record) {
                        if (field !== 'id') {
                            text += `    ${field}: ${record[field]}\n`;
                        }
                    }
                    text += '\n';
                }
            }
        }
    }

    if (data._comparisons) {
        text += `\n\n=== COMPARISON REPORT ===\n`;
        text += JSON.stringify(data._comparisons, null, 2);
    }

    return text;
}

function getExtractionStatus() {
    if (!extractionSession) {
        return Promise.resolve({
            isExtracting: false,
            percentage: 0,
            message: 'No active extraction',
            complete: true,
            results: []
        });
    }

    return Promise.resolve({
        isExtracting: extractionSession.status === 'extracting' || extractionSession.status === 'initializing',
        percentage: extractionSession.progress,
        message: extractionSession.message,
        details: extractionSession.details,
        complete: extractionSession.complete,
        results: extractionSession.results || []
    });
}

function cancelExtraction() {
    if (extractionSession) {
        extractionSession.status = 'cancelled';
        extractionSession.complete = true;
        extractionSession.message = 'Extraction cancelled by user';
    }
}

async function downloadFile(fileId, filename) {
    const storageKey = `export_${fileId}`;

    const result = await chrome.storage.local.get([storageKey]);

    if (result[storageKey]) {
        const fileData = result[storageKey];
        const blob = new Blob([fileData.content], { type: fileData.fileType });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
            url: url,
            filename: fileData.fileName,
            saveAs: true
        });

        // Cleanup after download
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }
}

async function getExtractedData() {
    if (extractionSession) {
        return extractionSession.extractedData;
    }
    return {};
}
