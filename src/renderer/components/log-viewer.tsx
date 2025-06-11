import { useEffect, useRef, useState } from 'react';
import { Button } from '@components/base/button';
import { Select } from '@components/base/select';

interface LogViewerProps {
  podName: string;
  namespace: string;
  containers: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const LogViewer = ({ 
  podName, 
  namespace, 
  containers, 
  autoRefresh = true,
  refreshInterval = 2000 
}: LogViewerProps): JSX.Element => {
  const [logs, setLogs] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>(containers[0] || '');
  const [isFollowing, setIsFollowing] = useState<boolean>(autoRefresh);
  const [tailLines, setTailLines] = useState<number>(1000);
  const [error, setError] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef<boolean>(true);

  const fetchLogs = async () => {
    if (!selectedContainer) return;
    
    try {
      const result = await window.electronAPI.readNamespacedPodLog(
        podName, 
        namespace, 
        selectedContainer,
        {
          tailLines: tailLines,
          timestamps: true
        }
      );
      
      if (result.success && result.data) {
        setLogs(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch logs');
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
      setError("Failed to fetch logs");
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchLogs();
    
    if (isFollowing) {
      const intervalId = setInterval(fetchLogs, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [podName, namespace, selectedContainer, isFollowing, tailLines]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (shouldScrollRef.current && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      // If user is near bottom (within 50px), keep auto-scrolling
      shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  const handleContainerChange = (value: string) => {
    setSelectedContainer(value);
    setLogs(''); // Clear logs when switching containers
  };

  const handleClearLogs = () => {
    setLogs('');
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${podName}-${selectedContainer}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4 p-2 bg-zinc-50 rounded-lg">
        {containers.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-700">Container:</label>
            <Select
              value={selectedContainer}
              onChange={(e) => handleContainerChange(e.target.value)}
            >
              {containers.map(container => (
                <option key={container} value={container}>{container}</option>
              ))}
            </Select>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700">Lines:</label>
          <Select
            value={tailLines.toString()}
            onChange={(e) => setTailLines(parseInt(e.target.value))}
          >
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="5000">5000</option>
          </Select>
        </div>

        <Button
          onClick={() => setIsFollowing(!isFollowing)}
          className={isFollowing ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>

        <Button onClick={fetchLogs}>
          Refresh
        </Button>

        <Button onClick={handleClearLogs}>
          Clear
        </Button>

        <Button onClick={handleDownloadLogs}>
          Download
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Log display */}
      <div 
        ref={logContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto bg-black text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap"
        style={{ minHeight: '400px' }}
      >
        {logs || 'No logs available...'}
      </div>
    </div>
  );
};