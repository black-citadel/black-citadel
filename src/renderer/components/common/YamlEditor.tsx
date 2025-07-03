import React, { useEffect } from 'react';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Configure Monaco loader to use local monaco-editor instead of CDN
loader.config({ monaco });

interface YamlEditorProps {
  value: string;
  height?: string;
  className?: string;
}

export const YamlEditor: React.FC<YamlEditorProps> = ({ 
  value, 
  height = '600px',
  className = ''
}) => {
  useEffect(() => {
    // Ensure loader is initialized
    loader.init().then((monaco) => {
      console.log('Monaco Editor initialized locally');
    });
  }, []);

  const handleEditorWillMount = (monaco: Monaco) => {
    // Configure YAML language features
    monaco.languages.yaml?.yamlDefaults?.setOptions?.({
      validate: true,
      schemas: []
    });
  };

  return (
    <div className={`border border-gray-700 rounded overflow-hidden ${className}`}>
      <Editor
        height={height}
        defaultLanguage="yaml"
        value={value}
        theme="vs-dark"
        beforeMount={handleEditorWillMount}
        options={{
          readOnly: true,
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