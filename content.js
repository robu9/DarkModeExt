// Universal Dark Mode Content Script
class DarkModeConverter {
    constructor() {
        this.isEnabled = false;
        this.styleId = 'universal-dark-mode-styles';
        this.domain = window.location.hostname;
        this.init();
    }

    async init() {
        try {
            // Check if dark mode should be enabled for this domain
            const result = await chrome.storage.local.get([this.domain, 'globalEnabled']);
            const isGlobalEnabled = result.globalEnabled !== false;
            const isDomainEnabled = result[this.domain] === true;
            
            if (isGlobalEnabled && isDomainEnabled) {
                this.enableDarkMode();
            }

            // Listen for messages from popup
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                try {
                    if (request.action === 'ping') {
                        sendResponse({ success: true, ready: true });
                    } else if (request.action === 'toggleDarkMode') {
                        if (request.enabled) {
                            this.enableDarkMode();
                        } else {
                            this.disableDarkMode();
                        }
                        sendResponse({ success: true });
                    } else if (request.action === 'resetDarkMode') {
                        this.forceReset();
                        sendResponse({ success: true });
                    }
                } catch (error) {
                    console.error('Dark mode error:', error);
                    sendResponse({ success: false, error: error.message });
                }
                return true; // Keep message channel open for async response
            });
        } catch (error) {
            console.error('Dark mode initialization error:', error);
        }
    }

    enableDarkMode() {
        if (this.isEnabled) return;
        
        this.isEnabled = true;
        this.injectStyles();
        
        // Add smooth transition
        document.documentElement.style.transition = 'filter 0.3s ease-in-out';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    disableDarkMode() {
        if (!this.isEnabled) return;
        
        this.isEnabled = false;
        this.removeStyles();
        
        // Add smooth transition
        document.documentElement.style.transition = 'filter 0.3s ease-in-out';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    forceReset() {
        // More aggressive reset that clears everything
        this.isEnabled = false;
        this.removeStyles();
        
        // Clear any lingering filters
        document.documentElement.style.filter = '';
        document.documentElement.style.background = '';
        document.body.style.filter = '';
        document.body.style.background = '';
        
        // Remove any other potential dark mode styles
        const allStyles = document.querySelectorAll('style[id*="dark"], style[id*="night"], style[id*="invert"]');
        allStyles.forEach(style => style.remove());
        
        // Force page refresh if needed
        setTimeout(() => {
            if (document.documentElement.style.filter) {
                window.location.reload();
            }
        }, 100);
    }

    injectStyles() {
        // Remove existing styles first
        this.removeStyles();

        const styles = `
            /* Universal Dark Mode Styles - Smart Color Conversion */
            
            /* Base dark theme */
            html, body {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            /* Main content containers */
            div, section, article, main, aside, nav, header, footer {
                background-color: var(--dm-bg, transparent) !important;
                color: var(--dm-text, inherit) !important;
            }
            
            /* Convert white/light backgrounds to dark */
            [style*="background-color: white"], 
            [style*="background-color: #fff"],
            [style*="background-color: #ffffff"],
            [style*="background: white"],
            [style*="background: #fff"],
            [style*="background: #ffffff"] {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            
            /* Convert light gray backgrounds */
            [style*="background-color: #f"], 
            [style*="background-color: #e"],
            [style*="background-color: #d"] {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            
            /* Text elements */
            p, span, div, h1, h2, h3, h4, h5, h6, li, td, th, label {
                color: #e0e0e0 !important;
            }
            
            /* Convert dark text to light */
            [style*="color: black"],
            [style*="color: #000"],
            [style*="color: #000000"],
            [style*="color: #333"],
            [style*="color: #222"],
            [style*="color: #111"] {
                color: #e0e0e0 !important;
            }
            
            /* Form elements */
            input, textarea, select {
                background-color: #333 !important;
                border: 1px solid #555 !important;
                color: #e0e0e0 !important;
            }
            
            input[type="text"], input[type="email"], input[type="password"], 
            input[type="search"], input[type="url"], textarea {
                background-color: #2a2a2a !important;
                border: 1px solid #555 !important;
                color: #e0e0e0 !important;
            }
            
            input::placeholder, textarea::placeholder {
                color: #aaa !important;
            }
            
            /* Buttons */
            button, input[type="button"], input[type="submit"] {
                background-color: #404040 !important;
                border: 1px solid #555 !important;
                color: #e0e0e0 !important;
            }
            
            button:hover, input[type="button"]:hover, input[type="submit"]:hover {
                background-color: #4a4a4a !important;
            }
            
            /* Links */
            a {
                color: #66b3ff !important;
            }
            
            a:visited {
                color: #cc99ff !important;
            }
            
            a:hover {
                color: #80c7ff !important;
            }
            
            /* Tables */
            table {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            
            th, td {
                border-color: #555 !important;
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            
            tr:nth-child(even) td {
                background-color: #2e2e2e !important;
            }
            
            /* Cards and panels */
            .card, .panel, .box, [class*="card"], [class*="panel"] {
                background-color: #2a2a2a !important;
                border-color: #555 !important;
                color: #e0e0e0 !important;
            }
            
            /* Modals and popups */
            .modal, .popup, .dialog, [class*="modal"], [class*="popup"], [class*="dialog"] {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            
            /* Code blocks */
            pre, code {
                background-color: #1e1e1e !important;
                color: #f8f8f2 !important;
                border: 1px solid #444 !important;
            }
            
            /* Scrollbars */
            ::-webkit-scrollbar {
                background-color: #2a2a2a !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background-color: #555 !important;
                border-radius: 4px !important;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background-color: #666 !important;
            }
            
            ::-webkit-scrollbar-track {
                background-color: #1a1a1a !important;
            }
            
            /* Navigation elements */
            nav, .nav, .navbar, .navigation {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            
            /* Headers and footers */
            header, .header, footer, .footer {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            
            /* Sidebar elements */
            .sidebar, .side-nav, aside {
                background-color: #252525 !important;
                color: #e0e0e0 !important;
            }
            
            /* Border fixes */
            * {
                border-color: #555 !important;
            }
            
            /* Preserve images, videos, and media */
            img, video, canvas, iframe, svg, picture {
                filter: none !important;
                opacity: 0.9 !important;
            }
            
            /* Preserve logos and avatars */
            img[alt*="logo" i], img[class*="logo" i], img[id*="logo" i],
            img[alt*="avatar" i], img[class*="avatar" i], img[id*="avatar" i] {
                filter: none !important;
                opacity: 1 !important;
            }
            
            /* Special fixes for common UI frameworks */
            
            /* Bootstrap */
            .bg-white { background-color: #2a2a2a !important; }
            .bg-light { background-color: #333 !important; }
            .text-dark { color: #e0e0e0 !important; }
            .text-black { color: #e0e0e0 !important; }
            .border-light { border-color: #555 !important; }
            
            /* Material Design */
            .mdc-card, .mat-card {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
            }
            
            /* Tailwind CSS */
            .bg-white { background-color: #2a2a2a !important; }
            .bg-gray-50, .bg-gray-100, .bg-gray-200 { background-color: #333 !important; }
            .text-black, .text-gray-900, .text-gray-800 { color: #e0e0e0 !important; }
            
            /* Common website elements */
            .content, .main-content, .page-content {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            /* Search boxes */
            input[type="search"], .search-box, .search-input {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            
            /* Dropdown menus */
            .dropdown, .dropdown-menu, select {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            
            option {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            
            /* Fix for elements that should stay unchanged */
            .no-dark-mode, [data-no-dark-mode] {
                filter: none !important;
                background: initial !important;
                color: initial !important;
            }
            
            /* Smooth transitions */
            * {
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
            }
            
            /* Override any remaining light backgrounds */
            [style*="background"]:not([style*="url"]):not([style*="gradient"]) {
                background-color: #2a2a2a !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = this.styleId;
        styleSheet.textContent = styles;
        
        // Insert at the end of head to override other styles
        (document.head || document.documentElement).appendChild(styleSheet);
        
        // Apply additional dynamic fixes
        this.applyDynamicFixes();
    }
    
    applyDynamicFixes() {
        // Fix elements with inline styles
        const elementsWithBg = document.querySelectorAll('[style*="background"]');
        elementsWithBg.forEach(el => {
            const style = el.getAttribute('style');
            if (style && (style.includes('white') || style.includes('#fff') || style.includes('#f'))) {
                el.style.backgroundColor = '#2a2a2a';
                el.style.color = '#e0e0e0';
            }
        });
        
        // Fix text color elements
        const elementsWithColor = document.querySelectorAll('[style*="color"]');
        elementsWithColor.forEach(el => {
            const style = el.getAttribute('style');
            if (style && (style.includes('black') || style.includes('#000') || style.includes('#333'))) {
                el.style.color = '#e0e0e0';
            }
        });
        
        // Observe for dynamically added content
        if (!this.observer) {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.fixNewElement(node);
                        }
                    });
                });
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    fixNewElement(element) {
        // Fix newly added elements
        if (element.style) {
            const bgColor = element.style.backgroundColor;
            const color = element.style.color;
            
            if (bgColor && (bgColor.includes('white') || bgColor.includes('#fff'))) {
                element.style.backgroundColor = '#2a2a2a';
                element.style.color = '#e0e0e0';
            }
            
            if (color && (color.includes('black') || color.includes('#000'))) {
                element.style.color = '#e0e0e0';
            }
        }
    }

    removeStyles() {
        const existingStyles = document.getElementById(this.styleId);
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // Stop observing mutations
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // Reset any inline filters
        document.documentElement.style.filter = '';
        document.documentElement.style.background = '';
        document.body.style.filter = '';
        document.body.style.background = '';
    }
}

// Initialize when DOM is ready
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new DarkModeConverter();
        });
    } else {
        new DarkModeConverter();
    }
} catch (error) {
    console.error('Failed to initialize dark mode:', error);
}