import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

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
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: content,
        language: language,
        theme: 'vs-dark',
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
        wordBasedSuggestions: false
      });
    }

    return () => {
      monacoRef.current?.dispose();
      monacoRef.current = null;
    };
  }, [language, readOnly]);

  useEffect(() => {
    if (monacoRef.current && content !== monacoRef.current.getValue()) {
      monacoRef.current.setValue(content);
    }
  }, [content]);

  return (
    <div 
      ref={editorRef} 
      className="mt-6 border border-gray-700 rounded"
      style={{ height }}
    />
  );
};