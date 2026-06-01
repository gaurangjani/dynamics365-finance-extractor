console.log('D365 Finance Extractor content script loaded');

// Listen for toggle message from extension icon
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received:', request.action);

    if (request.action === 'toggleSidebar') {
        const sidebar = document.getElementById('d365-sidebar-container');
        if (sidebar) {
            console.log('Removing sidebar');
            sidebar.remove();
            sendResponse({ success: true, action: 'removed' });
        } else {
            console.log('Injecting sidebar');
            injectSidebar();
            sendResponse({ success: true, action: 'injected' });
        }
        return true;
    }
});

function injectSidebar() {
    // Check if sidebar already exists
    if (document.getElementById('d365-sidebar-container')) {
        console.log('Sidebar already exists');
        return;
    }

    try {
        // Create sidebar HTML inline
        const sidebarHTML = `
            <div id="d365-sidebar-container" class="sidebar-container">
                <div class="sidebar-header">
                    <h2>⚙️ D365 Config</h2>
                    <button id="closeSidebar" class="close-btn" title="Close sidebar">✕</button>
                </div>

                <div id="statusAlert" class="alert alert-info" style="display: none;">
                    <span id="statusText"></span>
                </div>

                <form id="extractionForm" class="sidebar-form">
                    <!-- Legal Entities Selection -->
                    <div class="form-group">
                        <label class="form-label">Legal Entities</label>
                        <label class="checkbox-item">
                            <input type="checkbox" id="selectAllLE" class="le-select-all">
                            <span>Select All</span>
                        </label>
                        <div id="legalEntitiesList" class="le-list">
                            <div class="loading-text">Loading legal entities...</div>
                        </div>
                        <small id="leCounterText" class="counter-text">0 selected</small>
                    </div>

                    <!-- Module Selection -->
                    <div class="form-group">
                        <label class="form-label">D365F Modules</label>
                        <div class="module-buttons">
                            <button type="button" class="btn-small" id="selectAllModules">All</button>
                            <button type="button" class="btn-small" id="selectCoreModules">Core</button>
                            <button type="button" class="btn-small" id="clearAllModules">Clear</button>
                        </div>
                        <div id="modulesList" class="modules-compact">
                            <!-- Modules will be populated -->
                        </div>
                    </div>

                    <!-- Export Formats -->
                    <div class="form-group">
                        <label class="form-label">Export Format</label>
                        <div class="format-group">
                            <label class="radio-item">
                                <input type="radio" name="format" value="xlsx" checked>
                                <span>Excel</span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="csv">
                                <span>CSV</span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="json">
                                <span>JSON</span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="txt">
                                <span>Text</span>
                            </label>
                        </div>
                    </div>

                    <!-- Options -->
                    <label class="checkbox-item">
                        <input type="checkbox" id="includeComparison" checked>
                        <span>Include Comparison</span>
                    </label>

                    <!-- Action Button -->
                    <button type="submit" id="extractBtn" class="btn-extract">
                        Extract Configuration
                    </button>
                </form>

                <!-- Progress Section -->
                <div id="progressSection" class="progress-section" style="display: none;">
                    <div class="progress-header">
                        <span id="progressText">Starting...</span>
                        <span id="progressPercent">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div id="progressFill" class="progress-fill"></div>
                    </div>
                    <div id="progressDetails" class="progress-details"></div>
                </div>

                <!-- Results Section -->
                <div id="resultsSection" class="results-section" style="display: none;">
                    <h3>✓ Complete</h3>
                    <div id="resultsList" class="results-list"></div>
                    <button type="button" id="newExtractionBtn" class="btn-extract">
                        New Extraction
                    </button>
                </div>

                <div class="sidebar-footer">
                    <small>v1.0.0</small>
                </div>
            </div>
        `;

        // Create container
        const container = document.createElement('div');
        container.innerHTML = sidebarHTML;

        // Append to body
        const sidebarElement = container.firstElementChild;
        document.body.appendChild(sidebarElement);

        // Load sidebar CSS
        const linkCSS = document.createElement('link');
        linkCSS.rel = 'stylesheet';
        linkCSS.href = chrome.runtime.getURL('src/sidebar/sidebar.css');
        document.head.appendChild(linkCSS);

        // Load sidebar JS
        const scriptJS = document.createElement('script');
        scriptJS.src = chrome.runtime.getURL('src/sidebar/sidebar.js');
        document.body.appendChild(scriptJS);

        console.log('Sidebar injected successfully');

    } catch (error) {
        console.error('Error injecting sidebar:', error);
    }
}
