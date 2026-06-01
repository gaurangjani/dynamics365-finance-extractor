// Configuration comparison engine
class ConfigComparator {
    static compare(data) {
        const comparisons = {
            summary: this._generateSummary(data),
            entityComparisons: {},
            detailedDifferences: {}
        };

        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');

        // Compare each entity across legal entities
        for (const entity in data[legalEntities[0]] || {}) {
            comparisons.entityComparisons[entity] = this._compareEntity(data, entity, legalEntities);
            comparisons.detailedDifferences[entity] = this._getDetailedDifferences(data, entity, legalEntities);
        }

        return comparisons;
    }

    static _generateSummary(data) {
        const legalEntities = Object.keys(data).filter(k => k !== '_comparisons');
        const summary = {
            legalEntitiesCount: legalEntities.length,
            legalEntities: legalEntities,
            entitiesCount: 0,
            totalRecords: 0,
            entitiesMissingByLE: {},
            matchStatus: {}
        };

        for (const le of legalEntities) {
            summary.entitiesMissingByLE[le] = [];
            for (const entity in data[le]) {
                if (!summary.matchStatus[entity]) {
                    summary.matchStatus[entity] = [];
                }
                summary.matchStatus[entity].push(le);
            }
        }

        // Find missing entities
        const allEntities = new Set();
        for (const le of legalEntities) {
            Object.keys(data[le]).forEach(e => allEntities.add(e));
        }

        summary.entitiesCount = allEntities.size;

        for (const le of legalEntities) {
            for (const entity of allEntities) {
                if (!data[le][entity]) {
                    summary.entitiesMissingByLE[le].push(entity);
                }
                if (data[le][entity] && data[le][entity].records) {
                    summary.totalRecords += data[le][entity].records.length;
                }
            }
        }

        return summary;
    }

    static _compareEntity(data, entityName, legalEntities) {
        const comparison = {
            entity: entityName,
            comparisons: []
        };

        for (let i = 0; i < legalEntities.length; i++) {
            for (let j = i + 1; j < legalEntities.length; j++) {
                const le1 = legalEntities[i];
                const le2 = legalEntities[j];

                const data1 = data[le1][entityName] || { records: [], count: 0 };
                const data2 = data[le2][entityName] || { records: [], count: 0 };

                const pairComparison = this._comparePair(data1, data2, le1, le2);
                comparison.comparisons.push(pairComparison);
            }
        }

        return comparison;
    }

    static _comparePair(data1, data2, le1, le2) {
        const records1 = data1.records || [];
        const records2 = data2.records || [];

        return {
            pair: `${le1} ↔ ${le2}`,
            le1: le1,
            le2: le2,
            le1RecordCount: records1.length,
            le2RecordCount: records2.length,
            countDifference: Math.abs(records1.length - records2.length),
            isIdentical: records1.length === records2.length,
            status: records1.length === records2.length ? 'MATCH ✓' : 'DIFFERENCE ✗'
        };
    }

    static _getDetailedDifferences(data, entityName, legalEntities) {
        const differences = {
            entity: entityName,
            additions: {},
            removals: {},
            modifications: {},
            unchanged: 0
        };

        // Build a map of records by ID for each LE
        const recordMaps = {};
        for (const le of legalEntities) {
            recordMaps[le] = {};
            if (data[le][entityName] && data[le][entityName].records) {
                for (const record of data[le][entityName].records) {
                    recordMaps[le][record.id] = record;
                }
            }
        }

        // Find all unique record IDs
        const allIds = new Set();
        for (const le of legalEntities) {
            Object.keys(recordMaps[le]).forEach(id => allIds.add(id));
        }

        // Compare each record
        for (const recordId of allIds) {
            const recordPresence = {};
            for (const le of legalEntities) {
                recordPresence[le] = recordId in recordMaps[le];
            }

            // Check if record exists in all LEs
            const existsInAll = Object.values(recordPresence).every(v => v === true);
            const existsInNone = Object.values(recordPresence).every(v => v === false);

            if (existsInAll) {
                // Record exists in all LEs, check for modifications
                const isUnchanged = this._recordsAreIdentical(recordMaps, recordId, legalEntities);
                if (isUnchanged) {
                    differences.unchanged++;
                } else {
                    differences.modifications[recordId] = {
                        presentIn: legalEntities,
                        hasChanges: true
                    };
                }
            } else if (existsInNone) {
                // Should not happen
                continue;
            } else {
                // Record exists in some but not all LEs
                const presentIn = legalEntities.filter(le => recordPresence[le]);
                const missingFrom = legalEntities.filter(le => !recordPresence[le]);

                if (presentIn.length > 0) {
                    differences.additions[recordId] = {
                        presentIn: presentIn,
                        missingFrom: missingFrom
                    };
                }

                if (missingFrom.length > 0) {
                    differences.removals[recordId] = {
                        presentIn: presentIn,
                        missingFrom: missingFrom
                    };
                }
            }
        }

        return differences;
    }

    static _recordsAreIdentical(recordMaps, recordId, legalEntities) {
        const firstRecord = recordMaps[legalEntities[0]][recordId];
        const firstString = JSON.stringify(firstRecord);

        for (let i = 1; i < legalEntities.length; i++) {
            const le = legalEntities[i];
            const record = recordMaps[le][recordId];
            if (JSON.stringify(record) !== firstString) {
                return false;
            }
        }

        return true;
    }

    static generateComparisonReport(comparisons) {
        let report = '';

        report += '═══════════════════════════════════════════════════════════════\n';
        report += '              CONFIGURATION COMPARISON REPORT\n';
        report += '═══════════════════════════════════════════════════════════════\n\n';

        // Summary section
        const summary = comparisons.summary;
        report += 'SUMMARY\n';
        report += '───────────────────────────────────────────────────────────────\n';
        report += `Legal Entities Compared: ${summary.legalEntitiesCount}\n`;
        report += `${summary.legalEntities.join(', ')}\n`;
        report += `Total Entities: ${summary.entitiesCount}\n`;
        report += `Total Records: ${summary.totalRecords}\n\n`;

        // Missing entities section
        report += 'MISSING ENTITIES BY LEGAL ENTITY\n';
        report += '───────────────────────────────────────────────────────────────\n';
        for (const le in summary.entitiesMissingByLE) {
            const missing = summary.entitiesMissingByLE[le];
            if (missing.length > 0) {
                report += `${le}: ${missing.join(', ')}\n`;
            } else {
                report += `${le}: None (All entities present) ✓\n`;
            }
        }
        report += '\n';

        // Entity comparisons
        report += 'ENTITY COMPARISON RESULTS\n';
        report += '───────────────────────────────────────────────────────────────\n';
        for (const entity in comparisons.entityComparisons) {
            const entityComp = comparisons.entityComparisons[entity];
            report += `\n[${entity}]\n`;

            for (const comp of entityComp.comparisons) {
                report += `  ${comp.pair}\n`;
                report += `    LE1 Records: ${comp.le1RecordCount}\n`;
                report += `    LE2 Records: ${comp.le2RecordCount}\n`;
                report += `    Difference: ${comp.countDifference}\n`;
                report += `    Status: ${comp.status}\n`;
            }
        }
        report += '\n';

        // Detailed differences
        report += 'DETAILED DIFFERENCES\n';
        report += '───────────────────────────────────────────────────────────────\n';
        for (const entity in comparisons.detailedDifferences) {
            const details = comparisons.detailedDifferences[entity];
            report += `\n[${entity}]\n`;
            report += `  Unchanged Records: ${details.unchanged}\n`;
            report += `  Records with Modifications: ${Object.keys(details.modifications).length}\n`;
            report += `  Records Added (in some LEs): ${Object.keys(details.additions).length}\n`;
            report += `  Records Removed (from some LEs): ${Object.keys(details.removals).length}\n`;
        }

        return report;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigComparator;
}
