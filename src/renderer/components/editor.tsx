import React, { useEffect } from 'react';
import MonacoEditor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Configure Monaco loader to use local monaco-editor instead of CDN
loader.config({ monaco });

interface EditorProps {
  content: string;
  height?: string;
  language?: string;
  readOnly?: boolean;
}

export const Editor = ({ 
  content, 
  height = '80vh',
  language = 'yaml',
  readOnly = true
}: EditorProps): JSX.Element => {
  useEffect(() => {
    // Ensure loader is initialized
    loader.init().then((monaco) => {
      console.log('Monaco Editor initialized locally');
    });
  }, []);

  const handleEditorWillMount = (monaco: Monaco) => {
    // Configure YAML language features if needed
    if (language === 'yaml' && monaco.languages.yaml?.yamlDefaults?.setOptions) {
      monaco.languages.yaml.yamlDefaults.setOptions({
        validate: true,
        schemas: []
      });
    }
  };

  return (
    <div className="mt-6 overflow-hidden">
      <MonacoEditor
        height={height}
        defaultLanguage={language}
        value={content}
        theme="vs-dark"
        beforeMount={handleEditorWillMount}
        options={{
          readOnly: readOnly,
          minimap: {
            enabled: false
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible'
          },
          mouseWheelZoom: false,
          contextmenu: false,
          quickSuggestions: false,
          parameterHints: {
            enabled: false
          },
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: 'off',
          tabCompletion: 'off',
          wordBasedSuggestions: 'off'
        }}
      />
    </div>
  );
};