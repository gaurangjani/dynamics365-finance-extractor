console.log('D365 Finance Extractor content script loaded');

// Only listen for explicit toggle messages - don't auto-inject
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.action === 'toggleSidebar') {
            const sidebar = document.getElementById('d365-sidebar-container');
            if (sidebar) {
                sidebar.remove();
                sendResponse({ success: true, action: 'removed' });
            } else {
                injectSidebar();
                sendResponse({ success: true, action: 'injected' });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        sendResponse({ success: false, error: error.message });
    }
});

function injectSidebar() {
    if (document.getElementById('d365-sidebar-container')) {
        return;
    }

    try {
        // Create sidebar HTML
        const sidebarHTML = `
            <div id="d365-sidebar-container" class="sidebar-container">
                <div class="sidebar-header">
                    <h2>⚙️ D365 Config</h2>
                    <button id="closeSidebar" class="close-btn" title="Close">✕</button>
                </div>
                <div id="statusAlert" class="alert alert-info" style="display: none;">
                    <span id="statusText"></span>
                </div>
                <form id="extractionForm" class="sidebar-form">
                    <div class="form-group">
                        <label class="form-label">Legal Entities</label>
                        <label class="checkbox-item">
                            <input type="checkbox" id="selectAllLE" checked>
                            <span>Select All</span>
                        </label>
                        <div id="legalEntitiesList" class="le-list"></div>
                        <small id="leCounterText" class="counter-text">0 selected</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">D365F Modules</label>
                        <div class="module-buttons">
                            <button type="button" class="btn-small" id="selectAllModules">All</button>
                            <button type="button" class="btn-small" id="selectCoreModules">Core</button>
                            <button type="button" class="btn-small" id="clearAllModules">Clear</button>
                        </div>
                        <div id="modulesList" class="modules-compact"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Export Format</label>
                        <div class="format-group">
                            <label class="radio-item"><input type="radio" name="format" value="xlsx" checked><span>Excel</span></label>
                            <label class="radio-item"><input type="radio" name="format" value="csv"><span>CSV</span></label>
                            <label class="radio-item"><input type="radio" name="format" value="json"><span>JSON</span></label>
                            <label class="radio-item"><input type="radio" name="format" value="txt"><span>Text</span></label>
                        </div>
                    </div>
                    <label class="checkbox-item">
                        <input type="checkbox" id="includeComparison" checked>
                        <span>Include Comparison</span>
                    </label>
                    <button type="submit" id="extractBtn" class="btn-extract">Extract Configuration</button>
                </form>
                <div id="progressSection" class="progress-section" style="display: none;">
                    <div class="progress-header"><span id="progressText">Starting...</span><span id="progressPercent">0%</span></div>
                    <div class="progress-bar"><div id="progressFill" class="progress-fill"></div></div>
                    <div id="progressDetails" class="progress-details"></div>
                </div>
                <div id="resultsSection" class="results-section" style="display: none;">
                    <h3>✓ Complete</h3>
                    <div id="resultsList" class="results-list"></div>
                    <button type="button" id="newExtractionBtn" class="btn-extract">New Extraction</button>
                </div>
                <div class="sidebar-footer"><small>v1.0.0</small></div>
            </div>
        `;

        // Inject HTML
        const div = document.createElement('div');
        div.innerHTML = sidebarHTML;
        document.body.appendChild(div.firstElementChild);

        // Inject CSS
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = chrome.runtime.getURL('src/sidebar/sidebar.css');
        document.head.appendChild(css);

        // Inject JS with error handling
        setTimeout(() => {
            const js = document.createElement('script');
            js.onerror = () => console.error('Failed to load sidebar.js');
            js.src = chrome.runtime.getURL('src/sidebar/sidebar.js');
            document.body.appendChild(js);
        }, 100);

    } catch (error) {
        console.error('Sidebar injection error:', error);
    }
}
