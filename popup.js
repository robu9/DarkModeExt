document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('dark-mode-toggle');
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.getElementById('status-indicator');
    const domainDisplay = document.getElementById('current-domain');
    const resetBtn = document.getElementById('reset-btn');
    const settingsBtn = document.getElementById('settings-btn');

    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname;
    domainDisplay.textContent = domain;

    // Load current state
    const result = await chrome.storage.local.get([domain, 'globalEnabled']);
    const isGlobalEnabled = result.globalEnabled !== false;
    const isDomainEnabled = result[domain] === true;
    
    const isEnabled = isGlobalEnabled && isDomainEnabled;
    
    toggle.checked = isEnabled;
    updateStatus(isEnabled);

    // Toggle event
    toggle.addEventListener('change', async () => {
        const enabled = toggle.checked;
        
        // Save domain preference
        await chrome.storage.local.set({ [domain]: enabled });
        
        // Send message to content script
        try {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'toggleDarkMode',
                enabled: enabled
            });
            updateStatus(enabled);
        } catch (error) {
            console.error('Failed to toggle dark mode:', error);
            // Revert toggle if failed
            toggle.checked = !enabled;
        }
    });

    // Reset button - Force disable dark mode and clear settings
    resetBtn.addEventListener('click', async () => {
        try {
            // First disable dark mode
            await chrome.tabs.sendMessage(tab.id, {
                action: 'resetDarkMode'
            });
            
            // Update UI immediately
            toggle.checked = false;
            updateStatus(false);
            
            // Clear storage for this domain
            await chrome.storage.local.set({ [domain]: false });
            
            // Visual feedback
            resetBtn.style.background = 'rgba(61, 213, 152, 0.3)';
            resetBtn.innerHTML = '<span class="icon">✓</span><span class="label">Reset</span>';
            
            setTimeout(() => {
                resetBtn.style.background = '';
                resetBtn.innerHTML = '<span class="icon">🔄</span><span class="label">Reset</span>';
            }, 1000);
            
        } catch (error) {
            console.error('Failed to reset:', error);
            // Show error feedback
            resetBtn.style.background = 'rgba(255, 107, 107, 0.3)';
            resetBtn.innerHTML = '<span class="icon">✕</span><span class="label">Error</span>';
            
            setTimeout(() => {
                resetBtn.style.background = '';
                resetBtn.innerHTML = '<span class="icon">🔄</span><span class="label">Reset</span>';
            }, 1000);
            
            // Force reload the page as fallback
            chrome.tabs.reload(tab.id);
        }
    });

    // Settings button - Global settings and options
    settingsBtn.addEventListener('click', async () => {
        try {
            // Toggle between global enable/disable
            const result = await chrome.storage.local.get(['globalEnabled']);
            const currentGlobal = result.globalEnabled !== false;
            const newGlobal = !currentGlobal;
            
            await chrome.storage.local.set({ globalEnabled: newGlobal });
            
            // Visual feedback
            if (newGlobal) {
                settingsBtn.style.background = 'rgba(61, 213, 152, 0.3)';
                settingsBtn.innerHTML = '<span class="icon">✓</span><span class="label">Global ON</span>';
            } else {
                settingsBtn.style.background = 'rgba(255, 193, 7, 0.3)';
                settingsBtn.innerHTML = '<span class="icon">⚠️</span><span class="label">Global OFF</span>';
                
                // Also disable current site
                toggle.checked = false;
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleDarkMode',
                    enabled: false
                });
                updateStatus(false);
            }
            
            setTimeout(() => {
                settingsBtn.style.background = '';
                settingsBtn.innerHTML = '<span class="icon">⚙️</span><span class="label">Settings</span>';
            }, 2000);
            
        } catch (error) {
            console.error('Settings error:', error);
            settingsBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            setTimeout(() => {
                settingsBtn.style.background = '';
            }, 200);
        }
    });

    function updateStatus(enabled) {
        if (enabled) {
            statusText.textContent = 'Dark Mode Active';
            statusText.classList.remove('inactive');
            statusIndicator.classList.remove('inactive');
        } else {
            statusText.textContent = 'Light Mode';
            statusText.classList.add('inactive');
            statusIndicator.classList.add('inactive');
        }
    }
});
