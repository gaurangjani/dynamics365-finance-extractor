console.log('D365 Finance Extractor content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request.action);

    switch (request.action) {
        case 'getLegalEntities':
            getLegalEntities().then(data => {
                sendResponse({ success: true, data });
            }).catch(error => {
                console.error('Error getting legal entities:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true;

        case 'startExtraction':
            startExtraction(request).then(result => {
                sendResponse({ success: true, result });
            }).catch(error => {
                console.error('Error in extraction:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true;

        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

async function getLegalEntities() {
    // Extract legal entities from D365F UI
    // Try multiple methods to find legal entities

    // Method 1: Check page for company selector
    const companyElements = document.querySelectorAll('[data-value], .company-selector, [class*="company"], [id*="company"]');

    // Method 2: Try to find from navigation or header
    const navElements = document.querySelectorAll('header, nav, [role="navigation"]');

    // Method 3: Look for data attributes in main content
    const mainContent = document.querySelector('main, [role="main"], .main-content');

    let legalEntities = [];

    // Check if we can access the D365F OData API directly
    try {
        const response = await fetch('/_odata/v1/Companies', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken()
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.value) {
                legalEntities = data.value.map(le => ({
                    value: le.CompanyId || le.DataAreaId,
                    label: le.CompanyName || le.Name
                }));
            }
        }
    } catch (e) {
        console.log('OData API not available, using DOM extraction');
    }

    // Fallback: Extract from DOM
    if (legalEntities.length === 0) {
        legalEntities = extractFromDOM();
    }

    // If still empty, return mock data for development
    if (legalEntities.length === 0) {
        legalEntities = [
            { value: 'USPM', label: 'US Primary' },
            { value: 'USMF', label: 'US Manufacturing' },
            { value: 'JPMF', label: 'JP Manufacturing' }
        ];
    }

    return legalEntities;
}

function extractFromDOM() {
    const legalEntities = [];

    // Look for company selector in navigation
    const companySelectors = document.querySelectorAll('[class*="company"], [id*="company"], [data-company]');
    companySelectors.forEach(el => {
        const text = el.textContent.trim();
        if (text.length > 0 && text.length < 50) {
            const match = text.match(/([A-Z]{2,4})\s*-?\s*(.+)/);
            if (match) {
                legalEntities.push({
                    value: match[1],
                    label: match[2] || text
                });
            }
        }
    });

    return legalEntities;
}

function getAuthToken() {
    // Try to get auth token from page context or session storage
    if (window._auth && window._auth.token) {
        return window._auth.token;
    }

    const token = sessionStorage.getItem('auth_token');
    return token || '';
}

async function startExtraction(request) {
    const { legalEntities, entities, formats, includeComparison } = request;

    console.log('Starting extraction with:', { legalEntities, entities, formats, includeComparison });

    // Send extraction request to background service
    const result = await chrome.runtime.sendMessage({
        action: 'initializeExtraction',
        legalEntities,
        entities,
        formats,
        includeComparison
    });

    return result;
}

// Helper to build OData query URLs
function buildODataUrl(entityName, legalEntity = null, filters = []) {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/_odata/v1/${entityName}`;

    const queryParams = [];

    if (legalEntity) {
        queryParams.push(`$filter=DataAreaId eq '${legalEntity}'`);
    }

    if (filters.length > 0) {
        if (queryParams.length > 0) {
            queryParams[0] += ' and ' + filters.join(' and ');
        } else {
            queryParams.push(`$filter=${filters.join(' and ')}`);
        }
    }

    queryParams.push('$expand=*($expand=*)');

    if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
    }

    return url;
}

// Export utility function for background script
window.D365Extractor = {
    buildODataUrl,
    getAuthToken,
    getLegalEntities
};
