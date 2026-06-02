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
        modules: request.modules || [],
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
        moduleProgress: {},
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
    const totalModules = extractionSession.modules.length || 1;
    const totalSteps = totalLEs * totalEntities * totalModules;

    let currentStep = 0;

    try {
        // Initialize module progress tracking
        for (const module of (extractionSession.modules || [])) {
            extractionSession.moduleProgress[module] = { entities: 0, total: totalEntities, status: 'pending' };
        }

        // Process in batches for performance
        const BATCH_SIZE = 20;
        const leCount = totalLEs;

        for (let batch = 0; batch < Math.ceil(leCount / BATCH_SIZE); batch++) {
            const batchStart = batch * BATCH_SIZE;
            const batchEnd = Math.min(batchStart + BATCH_SIZE, leCount);
            const batchLEs = extractionSession.legalEntities.slice(batchStart, batchEnd);

            for (const legalEntity of batchLEs) {
                if (extractionSession.status !== 'extracting') break;

                extractionSession.extractedData[legalEntity] = {};

                // Extract by module
                for (const module of (extractionSession.modules || ['General Ledger'])) {
                    for (const entity of extractionSession.entities) {
                        if (extractionSession.status !== 'extracting') break;

                        currentStep++;
                        const percentage = Math.round((currentStep / totalSteps) * 100);

                        extractionSession.message = `Extracting ${entity} from ${module} (${legalEntity})...`;
                        extractionSession.progress = percentage;

                        // Update module progress
                        if (extractionSession.moduleProgress[module]) {
                            extractionSession.moduleProgress[module].status = 'in-progress';
                        }

                        try {
                            const entityData = await extractEntity(legalEntity, entity, module);
                            if (!extractionSession.extractedData[legalEntity][module]) {
                                extractionSession.extractedData[legalEntity][module] = {};
                            }
                            extractionSession.extractedData[legalEntity][module][entity] = entityData;
                            extractionSession.details.push(`✓ ${entity} (${module}) from ${legalEntity}`);
                        } catch (error) {
                            console.error(`Error extracting ${entity} for ${legalEntity}:`, error);
                            extractionSession.details.push(`⚠ ${entity} (${module}) from ${legalEntity}`);
                        }

                        // Update module progress
                        if (extractionSession.moduleProgress[module]) {
                            extractionSession.moduleProgress[module].entities++;
                        }
                    }
                }

                // Mark modules as complete for this LE
                for (const module of (extractionSession.modules || [])) {
                    if (extractionSession.moduleProgress[module]) {
                        extractionSession.moduleProgress[module].status = 'complete';
                    }
                }
            }
        }

        // Perform comparison if requested
        if (extractionSession.includeComparison) {
            extractionSession.message = 'Generating module-aware comparison report...';
            extractionSession.progress = 95;

            const comparisons = performComparison(extractionSession.extractedData, extractionSession.modules);
            extractionSession.extractedData._comparisons = comparisons;
            extractionSession.details.push('✓ Generated comparison report');
        }

        // Export data in requested formats
        extractionSession.message = 'Exporting data...';
        extractionSession.progress = 97;

        for (const format of extractionSession.formats) {
            try {
                await exportData(format, extractionSession.extractedData);
                extractionSession.details.push(`✓ Exported ${format.toUpperCase()}`);
            } catch (error) {
                console.error(`Error exporting ${format}:`, error);
                extractionSession.details.push(`⚠ Export error: ${format}`);
            }
        }

        extractionSession.status = 'complete';
        extractionSession.progress = 100;
        extractionSession.message = `Extraction completed! Extracted ${totalEntities} entities from ${totalModules} modules for ${totalLEs} legal entities.`;
        extractionSession.complete = true;

    } catch (error) {
        console.error('Fatal extraction error:', error);
        extractionSession.status = 'error';
        extractionSession.message = 'Error: ' + error.message;
        extractionSession.complete = true;
    }
}

async function extractEntity(legalEntity, entityName, module = 'General Ledger') {
    // Simulate OData API call with module context
    // In production, this would call the actual D365F OData API

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                entityName,
                module,
                legalEntity,
                count: Math.floor(Math.random() * 100) + 10,
                records: generateMockRecords(entityName)
            });
        }, 300 + Math.random() * 700);
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

function performComparison(extractedData, modules = []) {
    const comparisons = {
        summary: {
            modules: modules,
            totalLEs: 0,
            totalEntities: 0,
            comparisonPairs: 0
        },
        moduleComparisons: {},
        details: {}
    };

    const legalEntities = Object.keys(extractedData).filter(k => k !== '_comparisons');
    comparisons.summary.totalLEs = legalEntities.length;

    if (legalEntities.length === 0) return comparisons;

    // Compare by module
    for (const module of modules) {
        comparisons.moduleComparisons[module] = {
            module,
            entityCount: 0,
            matches: 0,
            differences: 0,
            missing: []
        };

        // Get entities in this module from first LE
        const firstLE = legalEntities[0];
        const moduleData = extractedData[firstLE][module] || {};
        const moduleEntities = Object.keys(moduleData);
        comparisons.moduleComparisons[module].entityCount = moduleEntities.length;
        comparisons.summary.totalEntities += moduleEntities.length;

        // Compare entities across LEs
        for (const entity of moduleEntities) {
            comparisons.details[`${module}_${entity}`] = {};

            for (let i = 0; i < legalEntities.length - 1; i++) {
                const le1 = legalEntities[i];
                const le2 = legalEntities[i + 1];

                const key = `${le1}_vs_${le2}`;
                const data1 = extractedData[le1][module]?.[entity] || {};
                const data2 = extractedData[le2][module]?.[entity] || {};

                const isMatch = data1.count === data2.count;
                if (isMatch) {
                    comparisons.moduleComparisons[module].matches++;
                } else {
                    comparisons.moduleComparisons[module].differences++;
                }

                comparisons.details[`${module}_${entity}`][key] = {
                    le1Count: data1.count || 0,
                    le2Count: data2.count || 0,
                    differences: Math.abs((data1.count || 0) - (data2.count || 0)),
                    match: isMatch
                };
            }
        }
    }

    comparisons.summary.comparisonPairs = legalEntities.length > 1 ? legalEntities.length - 1 : 0;
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
    let csv = 'LegalEntity,Module,Entity,RecordID,Field,Value\n';

    for (const le of legalEntities) {
        // Check if data is organized by modules
        for (const moduleOrEntity in data[le]) {
            const moduleData = data[le][moduleOrEntity];
            
            // If the structure has nested entities (module structure)
            if (moduleData && typeof moduleData === 'object' && !Array.isArray(moduleData) && moduleData.records === undefined) {
                // This is a module
                const module = moduleOrEntity;
                for (const entity in moduleData) {
                    const entityData = moduleData[entity];
                    if (entityData && entityData.records && Array.isArray(entityData.records)) {
                        for (const record of entityData.records) {
                            for (const field in record) {
                                const value = String(record[field]).replace(/"/g, '""');
                                csv += `"${le}","${module}","${entity}","${record.id || ''}","${field}","${value}"\n`;
                            }
                        }
                    }
                }
            } else if (moduleData && moduleData.records && Array.isArray(moduleData.records)) {
                // This is direct entity structure (legacy format)
                const entity = moduleOrEntity;
                for (const record of moduleData.records) {
                    for (const field in record) {
                        const value = String(record[field]).replace(/"/g, '""');
                        csv += `"${le}","General Ledger","${entity}","${record.id || ''}","${field}","${value}"\n`;
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
