// ANON HUB Tab Manager
let tabs = [];
let activeTabId = null;
let tabCounter = 1;

class Tab {
    constructor(id, name, content = '') {
        this.id = id;
        this.name = name;
        this.content = content;
        this.modified = false;
    }
}

// Initialize tab system
function initializeTabs() {
    // Create first tab
    const firstTab = new Tab('tab1', 'script1.lua', getDefaultScript());
    tabs.push(firstTab);
    activeTabId = 'tab1';
    
    renderTabs();
    switchToTab('tab1');
}

// Render tabs in the UI
function renderTabs() {
    const tabContainer = document.getElementById('tabContainer');
    tabContainer.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
        
        tabElement.innerHTML = `
            <span class="tab-name">${tab.name}${tab.modified ? ' •' : ''}</span>
            <span class="tab-close">×</span>
        `;
        
        // Tab click event
        tabElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                switchToTab(tab.id);
            }
        });
        
        // Close button event
        tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });
        
        // Tab-Umbenennung per Doppelklick - FIXED VERSION
        const tabName = tabElement.querySelector('.tab-name');
        tabName.addEventListener('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove the • indicator for editing
            const currentName = tab.name;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.className = 'tab-rename-input';
            input.style.cssText = `
                background: #2d2d30;
                color: white;
                border: 1px solid #007acc;
                padding: 2px 4px;
                font-size: 12px;
                width: 100px;
                border-radius: 2px;
                position: absolute;
                z-index: 1000;
            `;
            
            // Position the input over the tab name
            const rect = tabName.getBoundingClientRect();
            input.style.left = rect.left + 'px';
            input.style.top = rect.top + 'px';
            
            document.body.appendChild(input);
            input.focus();
            input.select();
            
            function finishRename() {
                const newName = input.value.trim() || currentName;
                if (newName !== currentName) {
                    tab.name = newName;
                    renderTabs(); // Re-render to update display
                }
                document.body.removeChild(input);
            }
            
            function cancelRename() {
                document.body.removeChild(input);
            }
            
            input.addEventListener('blur', finishRename);
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishRename();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelRename();
                }
            });
        });
        
        tabContainer.appendChild(tabElement);
    });
}

// Switch to a specific tab
function switchToTab(tabId) {
    // Save current tab content
    if (activeTabId && editor) {
        const currentTab = tabs.find(t => t.id === activeTabId);
        if (currentTab) {
            const newContent = getEditorContent();
            if (newContent !== currentTab.content) {
                currentTab.content = newContent;
                currentTab.modified = true;
            }
        }
    }
    
    // Switch to new tab
    activeTabId = tabId;
    const tab = tabs.find(t => t.id === tabId);
    if (tab && editor) {
        setEditorContent(tab.content);
    }
    
    renderTabs();
}

// Create new tab
function createNewTab() {
    tabCounter++;
    const newTab = new Tab(`tab${tabCounter}`, `script${tabCounter}.lua`, getDefaultScript());
    tabs.push(newTab);
    switchToTab(newTab.id);
}

// Close tab
function closeTab(tabId) {
    if (tabs.length === 1) {
        return; // Don't close last tab
    }
    
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const tab = tabs[tabIndex];
    
    // No confirmation dialog - just close tab
    
    // Remove tab
    tabs.splice(tabIndex, 1);
    
    // Switch to another tab if this was active
    if (activeTabId === tabId) {
        const newActiveIndex = Math.min(tabIndex, tabs.length - 1);
        switchToTab(tabs[newActiveIndex].id);
    }
    
    renderTabs();
}

// Open file in new tab
function openFileInTab(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        tabCounter++;
        const newTab = new Tab(`tab${tabCounter}`, file.name, e.target.result);
        tabs.push(newTab);
        switchToTab(newTab.id);
    };
    reader.readAsText(file);
}

// Save current tab directly to scripts/ folder without prompts
function saveCurrentTab() {
    if (!activeTabId) return;
    
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    
    // Update content
    tab.content = getEditorContent();
    tab.modified = false;
    
    // Prepare filename - keep original extension or add .lua
    let filename = tab.name;
    if (!filename.includes('.')) {
        filename = filename + '.lua';
    }
    
    // Direct save to scripts folder - no prompts or notifications
    saveToScriptsFolder(filename, tab.content);
    renderTabs();
}

// Save directly to scripts folder
function saveToScriptsFolder(filename, content) {
    // Create download that saves to scripts folder automatically
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scripts/${filename}`; // Save to scripts subfolder
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Open file function
function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.lua,.txt';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            openFileInTab(file);
        }
    };
    input.click();
}

// Get current tab
function getCurrentTab() {
    return tabs.find(t => t.id === activeTabId);
}

// Mark current tab as modified
function markCurrentTabModified() {
    if (activeTabId) {
        const tab = tabs.find(t => t.id === activeTabId);
        if (tab) {
            tab.modified = true;
            renderTabs();
        }
    }
}

// Export functions
window.initializeTabs = initializeTabs;
window.createNewTab = createNewTab;
window.openFileInTab = openFileInTab;
window.saveCurrentTab = saveCurrentTab;
window.openFile = openFile;
window.getCurrentTab = getCurrentTab;
window.markCurrentTabModified = markCurrentTabModified;
