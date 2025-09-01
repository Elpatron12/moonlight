// ANON HUB Monaco Editor Configuration
require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });

let editor;

// Initialize Monaco Editor
function initializeMonaco() {
    require(['vs/editor/editor.main'], function () {
        // Register Lua language
        monaco.languages.register({ id: 'lua' });
        
        // Lua Language Configuration
        monaco.languages.setMonarchTokensProvider('lua', {
            defaultToken: '',
            tokenPostfix: '.lua',
            keywords: [
                'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
                'function', 'goto', 'if', 'in', 'local', 'nil', 'not', 'or',
                'repeat', 'return', 'then', 'true', 'until', 'while'
            ],
            builtins: [
                'assert', 'collectgarbage', 'dofile', 'error', 'getfenv', 'getmetatable',
                'ipairs', 'load', 'loadfile', 'loadstring', 'module', 'next', 'pairs',
                'pcall', 'print', 'rawequal', 'rawget', 'rawset', 'require', 'select',
                'setfenv', 'setmetatable', 'tonumber', 'tostring', 'type', 'unpack',
                'xpcall', '_G', '_VERSION'
            ],
            robloxAPI: [
                'game', 'workspace', 'script', 'Enum', 'wait', 'spawn', 'delay',
                'tick', 'time', 'UserInputService', 'RunService', 'Players',
                'ReplicatedStorage', 'ServerStorage', 'StarterGui', 'StarterPack',
                'StarterPlayer', 'Lighting', 'SoundService', 'TweenService'
            ],
            operators: [
                '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
                '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
                '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
                '%=', '<<=', '>>=', '>>>='
            ],
            symbols: /[=><!~?:&|+\-*\/\^%]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
            tokenizer: {
                root: [
                    [/[a-zA-Z_]\w*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@builtins': 'type',
                            '@robloxAPI': 'function',
                            '@default': 'identifier'
                        }
                    }],
                    { include: '@whitespace' },
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],
                    [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                    [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                    [/\d+/, 'number'],
                    [/[;,.]/, 'delimiter'],
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],
                    [/'/, { token: 'string.quote', bracket: '@open', next: '@stringsingle' }],
                    [/\[\[/, { token: 'string.quote', bracket: '@open', next: '@stringmulti' }]
                ],
                string: [
                    [/[^\\"]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                stringsingle: [
                    [/[^\\']+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                stringmulti: [
                    [/[^\]]+/, 'string'],
                    [/\]\]/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                    [/\]/, 'string']
                ],
                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/--.*$/, 'comment']
                ]
            }
        });
        
        // Configure Lua language features
        monaco.languages.setLanguageConfiguration('lua', {
            comments: {
                lineComment: '--',
                blockComment: ['--[[', ']]']
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" }
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" }
            ]
        });
        
        // Define custom black theme
        monaco.editor.defineTheme('anon-black', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#191919',
                'editor.foreground': '#d4d4d4',
                'editorLineNumber.foreground': '#858585',
                'editorLineNumber.activeForeground': '#ffffff',
                'editor.lineHighlightBackground': '#1a1a1a',
                'editor.selectionBackground': '#264f78',
                'editor.inactiveSelectionBackground': '#3a3d41',
                'editorIndentGuide.background': '#404040',
                'editorIndentGuide.activeBackground': '#707070',
                'editor.wordHighlightBackground': '#575757b8',
                'editor.wordHighlightStrongBackground': '#004972b8',
                'editorCursor.foreground': '#aeafad',
                'editor.findMatchBackground': '#515c6a',
                'editor.findMatchHighlightBackground': '#ea5c0055',
                'editor.hoverHighlightBackground': '#264f7840',
                'editorHoverWidget.background': '#252526',
                'editorHoverWidget.border': '#454545',
                'minimap.background': '#191919',
                'minimap.foreground': '#d4d4d4',
                'minimapSlider.background': '#79797933',
                'minimapSlider.hoverBackground': '#646464b3',
                'minimapSlider.activeBackground': '#bfbfbf66',
                'scrollbar.shadow': '#191919',
                'scrollbarSlider.background': '#79797966',
                'scrollbarSlider.hoverBackground': '#646464b3',
                'scrollbarSlider.activeBackground': '#bfbfbf66'
            }
        });

        // Create editor instance
        editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: getDefaultScript(),
            language: 'lua',
            theme: 'anon-black',
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            lineNumbers: 'on',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
            readOnly: false,
            cursorStyle: 'line',
            cursorBlinking: 'blink',
            mouseWheelZoom: true,
            smoothScrolling: true,
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            renderIndentGuides: true,
            highlightActiveIndentGuide: true,
            suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
                showUsers: true,
                showIssues: true,
                snippetsPreventQuickSuggestions: false
            },
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            },
            quickSuggestionsDelay: 10,
            parameterHints: { enabled: true },
            autoIndent: 'full',
            formatOnType: true,
            formatOnPaste: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on'
        });
        
        // Register snippet provider
        monaco.languages.registerCompletionItemProvider('lua', {
            provideCompletionItems: function(model, position) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const suggestions = [
                    {
                        label: 'print',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'print("${1:message}")',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Print a message to the console',
                        range: range
                    },
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'if ${1:condition} then\n\t${2:-- code here}\nend',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'If statement',
                        range: range
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'for ${1:i} = ${2:1}, ${3:10} do\n\t${4:-- code here}\nend',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'For loop',
                        range: range
                    },
                    {
                        label: 'while',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'while ${1:condition} do\n\t${2:-- code here}\nend',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'While loop',
                        range: range
                    },
                    {
                        label: 'function',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'function ${1:name}(${2:parameters})\n\t${3:-- code here}\nend',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Function definition',
                        range: range
                    },
                    {
                        label: 'local',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'local ${1:variable} = ${2:value}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Local variable declaration',
                        range: range
                    },
                    {
                        label: 'game:GetService',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'game:GetService("${1:ServiceName}")',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Get a Roblox service',
                        range: range
                    },
                    {
                        label: 'Players.LocalPlayer',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'game:GetService("Players").LocalPlayer',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Get the local player',
                        range: range
                    },
                    {
                        label: 'workspace',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'workspace',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Reference to workspace',
                        range: range
                    },
                    {
                        label: 'wait',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'wait(${1:seconds})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Wait for specified seconds',
                        range: range
                    },
                    {
                        label: 'spawn',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'spawn(function()\n\t${1:-- code here}\nend)',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Spawn a new thread',
                        range: range
                    },
                    {
                        label: 'pcall',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'local success, result = pcall(function()\n\t${1:-- code here}\nend)',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Protected call',
                        range: range
                    },
                    {
                        label: 'table.insert',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'table.insert(${1:table}, ${2:value})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Insert value into table',
                        range: range
                    },
                    {
                        label: 'string.format',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'string.format("${1:format}", ${2:args})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Format string',
                        range: range
                    },
                    {
                        label: 'Vector3.new',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'Vector3.new(${1:x}, ${2:y}, ${3:z})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Create new Vector3',
                        range: range
                    },
                    {
                        label: 'CFrame.new',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'CFrame.new(${1:x}, ${2:y}, ${3:z})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Create new CFrame',
                        range: range
                    },
                    {
                        label: 'Instance.new',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'Instance.new("${1:ClassName}")',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Create new Instance',
                        range: range
                    }
                ];

                return { suggestions: suggestions };
            }
        });

        // Focus editor
        editor.focus();
    });
}

// Default script content
function getDefaultScript() {
    return `-- ANON Executor
-- Lua Script Editor

print("ANON Executor loaded successfully!")

-- Your scripts here...`;
}

// Get editor content
function getEditorContent() {
    return editor ? editor.getValue() : '';
}

// Set editor content
function setEditorContent(content) {
    if (editor) {
        editor.setValue(content);
    }
}

// Export functions to global window object for C# access
window.getEditorContent = getEditorContent;
window.setEditorContent = setEditorContent;
window.getDefaultScript = getDefaultScript;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMonaco();
});
