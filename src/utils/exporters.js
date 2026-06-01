// Export utilities for multiple formats
class ExportManager {
    static async exportToExcel(data, filename = 'export.xlsx') {
        // This requires the xlsx library
        // We'll handle this through a separate worker or library injection
        return this._generateExcelData(data);
    }

    static async exportToCSV(data, filename = 'export.csv') {
        const csv = this._generateCSV(data);
        return {
            filename,
            content: csv,
            type: 'text/csv'
        };
    }

    static async exportToJSON(data, filename = 'export.json') {
        const json = JSON.stringify(data, null, 2);
        return {
            filename,
            content: json,
            type: 'application/json'
        };
    }

    static async exportToText(data, filename = 'export.txt') {
        const text = this._generateText(data);
        return {
            filename,
            content: text,
            type: 'text/plain'
        };
    }

    static _generateExcelData(data) {
        // Create structured data for Excel export with module organization
        const workbook = {
            SheetNames: [],
            Sheets: {}
        };

        // Add metadata sheet
        workbook.SheetNames.push('Metadata');
        workbook.Sheets['Metadata'] = this._createMetadataSheet(data);

        // Add sheet for each module and entity
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        if (legalEntities.length > 0) {
            const firstLE = legalEntities[0];

            // Check if data is organized by module
            const isModuleData = Object.keys(firstLE in data ? data[firstLE] : {}).length > 0 &&
                                 typeof data[firstLE][Object.keys(data[firstLE])[0]] === 'object' &&
                                 data[firstLE][Object.keys(data[firstLE])[0]].records === undefined;

            if (isModuleData) {
                // Module-based organization
                for (const le of legalEntities) {
                    for (const module in data[le]) {
                        for (const entity in data[le][module]) {
                            const sheetName = `${module.substr(0, 10)}_${entity.substr(0, 15)}`.substr(0, 31);
                            if (!workbook.SheetNames.includes(sheetName)) {
                                workbook.SheetNames.push(sheetName);
                                workbook.Sheets[sheetName] = this._createModuleEntitySheet(data, module, entity);
                            }
                        }
                    }
                }
            } else {
                // Legacy entity-based organization
                for (const entity of Object.keys(data[firstLE] || {})) {
                    const sheetName = entity.substr(0, 31);
                    workbook.SheetNames.push(sheetName);
                    workbook.Sheets[sheetName] = this._createEntitySheet(data, entity);
                }
            }
        }

        // Add module summary sheet
        if (data._comparisons && data._comparisons.moduleComparisons) {
            workbook.SheetNames.push('Module_Summary');
            workbook.Sheets['Module_Summary'] = this._createModuleSummarySheet(data._comparisons);
        }

        // Add comparison sheet if available
        if (data._comparisons) {
            workbook.SheetNames.push('Comparison');
            workbook.Sheets['Comparison'] = this._createComparisonSheet(data._comparisons);
        }

        return workbook;
    }

    static _createModuleEntitySheet(data, module, entity) {
        const sheet = {};
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        let row = 1;

        // Header
        const header = ['Module', 'LegalEntity', 'Record ID', ...Object.keys(data[legalEntities[0]][module]?.[entity]?.records?.[0] || {})];
        header.forEach((col, idx) => {
            const cellRef = String.fromCharCode(65 + idx) + row;
            sheet[cellRef] = { v: col, t: 's' };
        });

        row++;

        // Data rows
        for (const le of legalEntities) {
            const entityData = data[le][module]?.[entity];
            if (entityData && entityData.records) {
                for (const record of entityData.records) {
                    sheet[`A${row}`] = { v: module, t: 's' };
                    sheet[`B${row}`] = { v: le, t: 's' };
                    sheet[`C${row}`] = { v: record.id || '', t: 's' };

                    let colIdx = 3;
                    for (const [key, value] of Object.entries(record)) {
                        if (key !== 'id') {
                            const cellRef = String.fromCharCode(65 + colIdx) + row;
                            sheet[cellRef] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
                            colIdx++;
                        }
                    }
                    row++;
                }
            }
        }

        sheet['!ref'] = `A1:${String.fromCharCode(64 + header.length)}${row}`;
        return sheet;
    }

    static _createModuleSummarySheet(comparisons) {
        const sheet = {};
        let row = 1;

        sheet[`A${row}`] = { v: 'Module', t: 's' };
        sheet[`B${row}`] = { v: 'Status', t: 's' };
        sheet[`C${row}`] = { v: 'Entities', t: 's' };
        sheet[`D${row}`] = { v: 'Matches', t: 's' };
        sheet[`E${row}`] = { v: 'Differences', t: 's' };

        row++;

        for (const module in comparisons.moduleComparisons || {}) {
            const stats = comparisons.moduleComparisons[module];
            sheet[`A${row}`] = { v: module, t: 's' };
            sheet[`B${row}`] = { v: 'Ready', t: 's' };
            sheet[`C${row}`] = { v: stats.entityCount, t: 'n' };
            sheet[`D${row}`] = { v: stats.matches, t: 'n' };
            sheet[`E${row}`] = { v: stats.differences, t: 'n' };
            row++;
        }

        sheet['!ref'] = `A1:E${row}`;
        return sheet;
    }

    static _createMetadataSheet(data) {
        const sheet = {};
        const metadata = {
            'Export Date': new Date().toLocaleString(),
            'Source System': 'Dynamics 365 Finance',
            'Legal Entities': Object.keys(data).filter(k => k !== '_comparisons').join(', '),
            'Total Records': this._countTotalRecords(data)
        };

        let row = 1;
        for (const [key, value] of Object.entries(metadata)) {
            const cellRef = `A${row}`;
            sheet[cellRef] = { v: key, t: 's' };
            sheet[`B${row}`] = { v: value, t: 's' };
            row++;
        }

        sheet['!ref'] = `A1:B${row}`;
        return sheet;
    }

    static _createEntitySheet(data, entityName) {
        const sheet = {};
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        let row = 1;

        // Header
        const header = ['LegalEntity', 'Record ID', ...Object.keys(data[legalEntities[0]][entityName]?.records?.[0] || {})];
        header.forEach((col, idx) => {
            const cellRef = String.fromCharCode(65 + idx) + row;
            sheet[cellRef] = { v: col, t: 's' };
        });

        row++;

        // Data rows
        for (const le of legalEntities) {
            const entityData = data[le][entityName];
            if (entityData && entityData.records) {
                for (const record of entityData.records) {
                    const col_a = `A${row}`;
                    sheet[col_a] = { v: le, t: 's' };

                    const col_b = `B${row}`;
                    sheet[col_b] = { v: record.id || '', t: 's' };

                    let colIdx = 2;
                    for (const [key, value] of Object.entries(record)) {
                        if (key !== 'id') {
                            const cellRef = String.fromCharCode(65 + colIdx) + row;
                            sheet[cellRef] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
                            colIdx++;
                        }
                    }

                    row++;
                }
            }
        }

        sheet['!ref'] = `A1:${String.fromCharCode(64 + header.length)}${row}`;
        return sheet;
    }

    static _createComparisonSheet(comparisons) {
        const sheet = {};
        let row = 1;

        sheet[`A${row}`] = { v: 'Entity', t: 's' };
        sheet[`B${row}`] = { v: 'Comparison', t: 's' };
        sheet[`C${row}`] = { v: 'LE1 Count', t: 's' };
        sheet[`D${row}`] = { v: 'LE2 Count', t: 's' };
        sheet[`E${row}`] = { v: 'Difference', t: 's' };
        sheet[`F${row}`] = { v: 'Match', t: 's' };

        row++;

        for (const entity in comparisons.details) {
            for (const comparison in comparisons.details[entity]) {
                const details = comparisons.details[entity][comparison];

                sheet[`A${row}`] = { v: entity, t: 's' };
                sheet[`B${row}`] = { v: comparison, t: 's' };
                sheet[`C${row}`] = { v: details.le1Count, t: 'n' };
                sheet[`D${row}`] = { v: details.le2Count, t: 'n' };
                sheet[`E${row}`] = { v: details.differences, t: 'n' };
                sheet[`F${row}`] = { v: details.match ? 'Yes' : 'No', t: 's' };

                row++;
            }
        }

        sheet['!ref'] = `A1:F${row}`;
        return sheet;
    }

    static _generateCSV(data) {
        let csv = 'LegalEntity,Module,Entity,RecordID,Field,Value\n';

        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        for (const le of legalEntities) {
            for (const module in data[le]) {
                for (const entity in data[le][module]) {
                    const moduleData = data[le][module][entity];
                    if (moduleData && moduleData.records) {
                        for (const record of moduleData.records) {
                            for (const field in record) {
                                const value = this._escapeCSV(record[field]);
                                csv += `"${le}","${module}","${entity}","${record.id || ''}","${field}","${value}"\n`;
                            }
                        }
                    }
                }
            }
        }

        if (data._comparisons) {
            csv += '\n\n# MODULE COMPARISON REPORT\n';
            csv += 'Module,Entities,Matches,Differences\n';

            for (const module in data._comparisons.moduleComparisons || {}) {
                const stats = data._comparisons.moduleComparisons[module];
                csv += `"${module}","${stats.entityCount}","${stats.matches}","${stats.differences}"\n`;
            }
        }

        return csv;
    }

    static _generateText(data) {
        let text = '╔════════════════════════════════════════════════════════════════╗\n';
        text += '║   D365 FINANCE MULTI-MODULE CONFIGURATION EXPORT REPORT        ║\n';
        text += '╚════════════════════════════════════════════════════════════════╝\n\n';

        text += `Generated: ${new Date().toLocaleString()}\n`;
        text += `Source: Dynamics 365 Finance\n`;
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');
        text += `Total Legal Entities: ${legalEntities.length}\n`;
        text += `Total Modules: ${data._comparisons?.summary?.modulesCount || 0}\n\n`;

        // Module summary
        if (data._comparisons?.moduleComparisons) {
            text += '╔═ MODULE SUMMARY ═══════════════════════════════════════════════╗\n';
            for (const module in data._comparisons.moduleComparisons) {
                const stats = data._comparisons.moduleComparisons[module];
                text += `\n  ${module}\n`;
                text += `    Entities: ${stats.entityCount} | Matches: ${stats.matches} | Differences: ${stats.differences}\n`;
            }
            text += '\n' + '╚' + '═'.repeat(68) + '╝\n\n';
        }

        for (const le of legalEntities) {
            text += `\n┌─ LEGAL ENTITY: ${le} ${'─'.repeat(Math.max(0, 52 - le.length))}┐\n`;

            for (const module in data[le]) {
                text += `\n  Module: ${module}\n`;
                text += '  ' + '─'.repeat(60) + '\n';

                for (const entity in data[le][module]) {
                    const entityData = data[le][module][entity];
                    text += `\n    Entity: ${entity}\n`;
                    text += `    Records: ${entityData?.records?.length || 0}\n`;

                    if (entityData && entityData.records && entityData.records.length > 0) {
                        const sample = entityData.records[0];
                        for (const field in sample) {
                            if (field !== 'id') {
                                text += `      ${field}: ${sample[field]}\n`;
                            }
                        }
                    }
                }
            }

            text += '\n' + '└' + '─'.repeat(70) + '┘\n';
        }

        if (data._comparisons) {
            text += '\n\n╔═══════════════════════════════════════════════════════════════════╗\n';
            text += '║                   MODULE COMPARISON REPORT                      ║\n';
            text += '╚═══════════════════════════════════════════════════════════════════╝\n\n';

            for (const module in data._comparisons.moduleComparisons || {}) {
                const mc = data._comparisons.moduleComparisons[module];
                text += `\n[${module}]\n`;
                text += '─'.repeat(70) + '\n';
                text += `  Entity Count: ${mc.entityCount}\n`;
                text += `  Matches: ${mc.matches} | Differences: ${mc.differences}\n`;

                if (mc.missingByLE) {
                    for (const le in mc.missingByLE) {
                        if (mc.missingByLE[le].length > 0) {
                            text += `\n  Missing in ${le}: ${mc.missingByLE[le].join(', ')}\n`;
                        }
                    }
                }
            }
        }

        return text;
    }

    static _escapeCSV(value) {
        if (value === null || value === undefined) return '';
        const str = String(value);
        return str.replace(/"/g, '""');
    }

    static _countTotalRecords(data) {
        let count = 0;
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        for (const le of legalEntities) {
            for (const entity in data[le]) {
                if (data[le][entity] && data[le][entity].records) {
                    count += data[le][entity].records.length;
                }
            }
        }

        return count;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}
