// ANON HUB Monaco Editor Main Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs first
    initializeTabs();
    
    // Event listeners for tab controls - no save button in Monaco
    // Save functionality is handled by the Executor application
    
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
    
    // Remove broken tab rename code from main.js - it's handled in tab-manager.js
    
    // Keyboard shortcuts - no save shortcut in Monaco
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
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
