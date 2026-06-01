console.log('D365 Finance Extractor content script loaded');

// Inject sidebar on page load
function injectSidebar() {
    // Check if sidebar already exists
    if (document.getElementById('d365-sidebar-container')) {
        console.log('Sidebar already injected');
        return;
    }

    // Load sidebar HTML
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const sidebarHTML = xhr.responseText;

            // Create container
            const container = document.createElement('div');
            container.innerHTML = sidebarHTML;

            // Append to body
            document.body.appendChild(container.firstElementChild);

            // Load sidebar CSS
            const linkCSS = document.createElement('link');
            linkCSS.rel = 'stylesheet';
            linkCSS.href = chrome.runtime.getURL('src/sidebar/sidebar.css');
            document.head.appendChild(linkCSS);

            // Load sidebar JS
            const scriptJS = document.createElement('script');
            scriptJS.src = chrome.runtime.getURL('src/sidebar/sidebar.js');
            scriptJS.onload = function() {
                this.remove();
            };
            document.head.appendChild(scriptJS);

            console.log('Sidebar injected successfully');
        }
    };

    xhr.open('GET', chrome.runtime.getURL('src/sidebar/sidebar.html'), true);
    xhr.send();
}

// Inject on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSidebar);
} else {
    injectSidebar();
}

// Also inject if page is already loaded
window.addEventListener('load', injectSidebar);

// Listen for toggle message from extension icon
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleSidebar') {
        const sidebar = document.getElementById('d365-sidebar-container');
        if (sidebar) {
            sidebar.remove();
        } else {
            injectSidebar();
        }
        sendResponse({ success: true });
    }
});
