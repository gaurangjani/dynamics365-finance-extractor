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
        // Create structured data for Excel export
        const workbook = {
            SheetNames: [],
            Sheets: {}
        };

        // Add metadata sheet
        workbook.SheetNames.push('Metadata');
        workbook.Sheets['Metadata'] = this._createMetadataSheet(data);

        // Add sheet for each entity
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        for (const entity of Object.keys(data[legalEntities[0]] || {})) {
            const sheetName = entity.substr(0, 31); // Excel sheet name limit
            workbook.SheetNames.push(sheetName);
            workbook.Sheets[sheetName] = this._createEntitySheet(data, entity);
        }

        // Add comparison sheet if available
        if (data._comparisons) {
            workbook.SheetNames.push('Comparison');
            workbook.Sheets['Comparison'] = this._createComparisonSheet(data._comparisons);
        }

        return workbook;
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
        let csv = 'LegalEntity,Entity,RecordID,Field,Value\n';

        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        for (const le of legalEntities) {
            for (const entity in data[le]) {
                if (data[le][entity] && data[le][entity].records) {
                    for (const record of data[le][entity].records) {
                        for (const field in record) {
                            const value = this._escapeCSV(record[field]);
                            csv += `"${le}","${entity}","${record.id}","${field}","${value}"\n`;
                        }
                    }
                }
            }
        }

        if (data._comparisons) {
            csv += '\n\n# COMPARISON REPORT\n';
            csv += 'Entity,Comparison,LE1Count,LE2Count,Difference,Match\n';

            for (const entity in data._comparisons.details) {
                for (const comparison in data._comparisons.details[entity]) {
                    const details = data._comparisons.details[entity][comparison];
                    csv += `"${entity}","${comparison}","${details.le1Count}","${details.le2Count}","${details.differences}","${details.match}"\n`;
                }
            }
        }

        return csv;
    }

    static _generateText(data) {
        let text = '╔════════════════════════════════════════════════════════════════╗\n';
        text += '║     D365 FINANCE CONFIGURATION EXPORT REPORT                    ║\n';
        text += '╚════════════════════════════════════════════════════════════════╝\n\n';

        text += `Generated: ${new Date().toLocaleString()}\n`;
        text += `Source: Dynamics 365 Finance\n`;
        text += `Total Legal Entities: ${Object.keys(data).filter(k => k !== '_comparisons').length}\n\n`;

        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        for (const le of legalEntities) {
            text += `\n┌─ LEGAL ENTITY: ${le} ${'─'.repeat(Math.max(0, 60 - le.length))}┐\n`;

            for (const entity in data[le]) {
                const entityData = data[le][entity];
                text += `\n  Entity: ${entity}\n`;
                text += `  Records: ${entityData?.records?.length || 0}\n`;
                text += '  ' + '─'.repeat(60) + '\n';

                if (entityData && entityData.records) {
                    for (const record of entityData.records) {
                        text += `\n    [${record.id}]\n`;
                        for (const field in record) {
                            if (field !== 'id') {
                                text += `      ${field}: ${record[field]}\n`;
                            }
                        }
                    }
                }
            }

            text += '\n' + '└' + '─'.repeat(70) + '┘\n';
        }

        if (data._comparisons) {
            text += '\n\n╔═══════════════════════════════════════════════════════════════════╗\n';
            text += '║                       COMPARISON REPORT                           ║\n';
            text += '╚═══════════════════════════════════════════════════════════════════╝\n\n';

            for (const entity in data._comparisons.details) {
                text += `\n[${entity}]\n`;
                text += '─'.repeat(70) + '\n';

                for (const comparison in data._comparisons.details[entity]) {
                    const details = data._comparisons.details[entity][comparison];
                    text += `\n  ${comparison}\n`;
                    text += `    LE1 Count: ${details.le1Count}\n`;
                    text += `    LE2 Count: ${details.le2Count}\n`;
                    text += `    Difference: ${details.differences}\n`;
                    text += `    Match: ${details.match ? 'Yes ✓' : 'No ✗'}\n`;
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
