import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { ExecRequest } from '@utils/types';

interface PodTerminalProps {
  podName: string;
  namespace: string;
  containerName?: string;
  onClose?: () => void;
}

export const PodTerminal: React.FC<PodTerminalProps> = ({
  podName,
  namespace,
  containerName,
  onClose
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#d4d4d4',
        cursor: '#fffff',
        cursorAccent: '#000000',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      }
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();
    
    fitAddonRef.current = fitAddon;
    setTerminal(term);

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);

    // Initialize exec session
    initializeSession(term);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (sessionId) {
        window.electronAPI.closeExecSession(sessionId);
      }
      term.dispose();
    };
  }, []);

  const initializeSession = async (term: Terminal) => {
    try {
      const execRequest: ExecRequest = {
        podName,
        namespace,
        containerName,
        command: ['/bin/sh'],
        tty: true,
        stdin: true
      };

      const result = await window.electronAPI.createExecSession(execRequest);
      
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        setIsConnecting(false);
        
        term.writeln(`Connecting to ${podName}${containerName ? `:${containerName}` : ''}...`);
        term.writeln('');
        
        // Handle terminal input
        term.onData((data) => {
          if (result.sessionId) {
            window.electronAPI.execSend(result.sessionId, data);
          }
        });

        // Handle terminal resize
        term.onResize(({ rows, cols }) => {
          if (result.sessionId && fitAddonRef.current) {
            window.electronAPI.execResize(result.sessionId, rows, cols);
          }
        });

        // Start polling for output
        startOutputPolling(term, result.sessionId);
      } else {
        setError(result.error || 'Failed to create exec session');
        term.writeln(`\x1b[31mError: ${result.error || 'Failed to create exec session'}\x1b[0m`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      term.writeln(`\x1b[31mError: ${errorMessage}\x1b[0m`);
    }
  };

  const startOutputPolling = (term: Terminal, sid: string) => {
    const poll = async () => {
      try {
        const result = await window.electronAPI.execReceive(sid);
        if (result.success && result.data) {
          term.write(result.data);
        }
      } catch (err) {
        console.error('Error receiving exec data:', err);
      }
    };

    // Poll for output
    pollIntervalRef.current = setInterval(poll, 50);
  };

  const handleDisconnect = async () => {
    if (sessionId) {
      await window.electronAPI.closeExecSession(sessionId);
      setSessionId(null);
      if (terminal) {
        terminal.clear();
        terminal.writeln('\x1b[33mSession disconnected. Refresh the page to reconnect.\x1b[0m');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">Terminal</span>
          <span className="text-sm text-gray-400">
            {podName}{containerName ? `:${containerName}` : ''}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-gray-400 hover:text-gray-200 transition-colors"
          title="Disconnect terminal session"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
      
      {error && (
        <div className="px-4 py-2 bg-red-900/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {isConnecting && !error && (
        <div className="px-4 py-2 text-gray-400 text-sm">
          Connecting...
        </div>
      )}
      
      <div ref={terminalRef} className="flex-1 p-2" />
    </div>
  );
};