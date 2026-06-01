document.getElementById('toggleBtn').addEventListener('click', async () => {
    try {
        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            showStatus('No active tab found', 'error');
            return;
        }

        // Check if we're on a D365F page
        if (!tab.url.includes('dynamics.com')) {
            showStatus('Please open a D365F page first', 'error');
            return;
        }

        // Send toggle message to content script
        chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                showStatus('Opening sidebar...', 'success');
                // Give it a moment to inject
                setTimeout(() => window.close(), 800);
            } else if (response && response.success) {
                showStatus('Sidebar toggled!', 'success');
                setTimeout(() => window.close(), 800);
            } else {
                showStatus('Opening sidebar...', 'success');
                setTimeout(() => window.close(), 800);
            }
        });

    } catch (error) {
        console.error('Error:', error);
        showStatus('Error: ' + error.message, 'error');
    }
});

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
}

// Show initial message
showStatus('Ready to open', 'info');
