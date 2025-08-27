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
        
        // Tab-Umbenennung per Doppelklick
        const tabName = tabElement.querySelector('.tab-name');
        tabName.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'text';
            input.value = tab.name;
            input.className = 'tab-rename-input';
            input.style.cssText = `
                background: #2d2d30;
                color: white;
                border: 1px solid #007acc;
                padding: 2px 4px;
                font-size: 12px;
                width: 80px;
                border-radius: 2px;
            `;
            
            tabName.style.display = 'none';
            tabElement.insertBefore(input, tabName);
            input.focus();
            input.select();
            
            function finishRename() {
                const newName = input.value.trim() || tab.name;
                tab.name = newName;
                tabName.textContent = newName + (tab.modified ? ' •' : '');
                tabName.style.display = '';
                input.remove();
                renderTabs();
            }
            
            input.addEventListener('blur', finishRename);
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    finishRename();
                } else if (e.key === 'Escape') {
                    tabName.style.display = '';
                    input.remove();
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
    
    // Check if tab is modified
    if (tab.modified) {
        if (!confirm(`"${tab.name}" wurde geändert. Schließen ohne zu speichern?`)) {
            return;
        }
    }
    
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

// Save current tab - als .txt speichern
function saveCurrentTab() {
    if (!activeTabId) return;
    
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    
    // Update content
    tab.content = getEditorContent();
    tab.modified = false;
    
    // Dateiname für .txt konvertieren
    let filename = tab.name;
    if (filename.endsWith('.lua')) {
        filename = filename.replace('.lua', '.txt');
    } else if (!filename.endsWith('.txt')) {
        filename = filename + '.txt';
    }
    
    // Create download
    const blob = new Blob([tab.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    renderTabs();
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
