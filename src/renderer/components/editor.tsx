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
  height = '90vh',
  language = 'yaml',
  readOnly = true
}: EditorProps): JSX.Element => {
  useEffect(() => {
    // Ensure loader is initialized
    loader.init().then((_monaco) => {
      console.log('Monaco Editor initialized locally');
    });
  }, []);

  const handleEditorWillMount = (monaco: Monaco) => {
    // Define custom theme with #0a0a0a background
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0a0a'
      }
    });
  };

  return (
    <div className="mt-6 overflow-hidden">
      <MonacoEditor
        height={height}
        defaultLanguage={language}
        value={content}
        theme="custom-dark"
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