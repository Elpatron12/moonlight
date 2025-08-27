// ANON HUB Monaco Editor Main Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs first
    initializeTabs();
    
    // Event listeners for tab controls
    document.getElementById('newTabBtn').addEventListener('click', createNewTab);
    
    document.getElementById('openFileBtn').addEventListener('click', function() {
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
    });
    
    document.getElementById('saveFileBtn').addEventListener('click', saveCurrentTab);
    
    // Track editor changes for tab modification indicator
    let changeTimeout;
    function onEditorChange() {
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(() => {
            markCurrentTabModified();
        }, 500);
    }
    
    // Wait for editor to be ready, then add change listener
    const checkEditor = setInterval(() => {
        if (window.editor) {
            editor.onDidChangeModelContent(onEditorChange);
            clearInterval(checkEditor);
        }
    }, 100);
    
    // Tab-Titel doppelklick für umbenennen
    tabTitle.addEventListener('dblclick', function(e) {
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
        
        tabTitle.style.display = 'none';
        tabElement.insertBefore(input, tabTitle);
        input.focus();
        input.select();
        
        function finishRename() {
            const newName = input.value.trim() || tab.name;
            tab.name = newName;
            tabTitle.textContent = newName;
            tabTitle.style.display = '';
            input.remove();
            updateTabsDisplay();
        }
        
        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                finishRename();
            } else if (e.key === 'Escape') {
                tabTitle.style.display = '';
                input.remove();
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    saveCurrentTab();
                    break;
                case 'o':
                    e.preventDefault();
                    document.getElementById('openFileBtn').click();
                    break;
                case 't':
                    e.preventDefault();
                    createNewTab();
                    break;
                case 'w':
                    e.preventDefault();
                    const currentTab = getCurrentTab();
                    if (currentTab) {
                        closeTab(currentTab.id);
                    }
                    break;
            }
        }
    });
});
