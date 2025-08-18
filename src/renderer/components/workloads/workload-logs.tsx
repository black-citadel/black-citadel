import { useEffect, useRef, useState } from 'react';
import { Button, Select } from '@protoku-bv/design-system';
import k8s = require('@kubernetes/client-node');

interface WorkloadLogsProps {
  pods: k8s.V1Pod[];
  namespace: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface LogEntry {
  timestamp: string;
  podName: string;
  containerName: string;
  message: string;
}

export const WorkloadLogs = ({ 
  pods, 
  namespace, 
  autoRefresh = true,
  refreshInterval = 2000 
}: WorkloadLogsProps): JSX.Element => {
  const [combinedLogs, setCombinedLogs] = useState<LogEntry[]>([]);
  const [selectedPods, setSelectedPods] = useState<string[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [isFollowing, setIsFollowing] = useState<boolean>(autoRefresh);
  const [tailLines, setTailLines] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);
  const [showPodNames, setShowPodNames] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef<boolean>(true);
  
  // Single pod mode when there's only one pod
  const isSinglePod = pods.length === 1;
  const allContainers = isSinglePod 
    ? pods[0].spec.containers.map(c => c.name)
    : [];

  // Initialize selected pods and container
  useEffect(() => {
    if (pods.length > 0 && selectedPods.length === 0) {
      setSelectedPods(pods.map(pod => pod.metadata.name));
    }
    
    // In single pod mode, initialize selected container
    if (isSinglePod && allContainers.length > 0 && !selectedContainer) {
      setSelectedContainer(allContainers[0]);
    }
  }, [pods, isSinglePod, allContainers]);

  const parseLogLine = (line: string, podName: string, containerName: string): LogEntry | null => {
    // Kubernetes log format with timestamp: "2024-01-01T00:00:00.000000Z message"
    const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+(.*)$/);
    
    if (timestampMatch) {
      return {
        timestamp: timestampMatch[1],
        podName,
        containerName,
        message: timestampMatch[2]
      };
    }
    
    // If no timestamp, use current time
    return {
      timestamp: new Date().toISOString(),
      podName,
      containerName,
      message: line
    };
  };

  const fetchLogs = async () => {
    if (selectedPods.length === 0) {
      setCombinedLogs([]);
      return;
    }

    try {
      const allLogs: LogEntry[] = [];
      const errors: string[] = [];

      // Fetch logs based on mode
      if (isSinglePod && selectedContainer) {
        // Single pod mode - fetch only selected container
        const pod = pods[0];
        try {
          const result = await window.electronAPI.readNamespacedPodLog(
            pod.metadata.name,
            namespace,
            selectedContainer,
            {
              tailLines: tailLines,
              timestamps: true
            }
          );

          if (result.success && result.data) {
            const lines = result.data.split('\n').filter(line => line.trim());
            const parsedLogs = lines
              .map(line => parseLogLine(line, pod.metadata.name, selectedContainer))
              .filter(log => log !== null) as LogEntry[];
            
            allLogs.push(...parsedLogs);
          } else if (result.error) {
            errors.push(`${pod.metadata.name}/${selectedContainer}: ${result.error}`);
          }
        } catch (e) {
          console.error(`Failed to fetch logs for ${pod.metadata.name}/${selectedContainer}:`, e);
          errors.push(`${pod.metadata.name}/${selectedContainer}: Failed to fetch logs`);
        }
      } else {
        // Multi-pod mode - fetch from all selected pods and their containers
        await Promise.all(
          pods
            .filter(pod => selectedPods.includes(pod.metadata.name))
            .map(async (pod) => {
              const containers = pod.spec.containers || [];
              
              await Promise.all(
                containers.map(async (container) => {
                  try {
                    const result = await window.electronAPI.readNamespacedPodLog(
                      pod.metadata.name,
                      namespace,
                      container.name,
                      {
                        tailLines: tailLines,
                        timestamps: true
                      }
                    );

                    if (result.success && result.data) {
                      const lines = result.data.split('\n').filter(line => line.trim());
                      const parsedLogs = lines
                        .map(line => parseLogLine(line, pod.metadata.name, container.name))
                        .filter(log => log !== null) as LogEntry[];
                      
                      allLogs.push(...parsedLogs);
                    } else if (result.error) {
                      errors.push(`${pod.metadata.name}/${container.name}: ${result.error}`);
                    }
                  } catch (e) {
                    console.error(`Failed to fetch logs for ${pod.metadata.name}/${container.name}:`, e);
                    errors.push(`${pod.metadata.name}/${container.name}: Failed to fetch logs`);
                  }
                })
              );
            })
        );
      }

      // Sort logs by timestamp, then by pod name for consistency
      allLogs.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        
        // First sort by timestamp
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        
        // If timestamps are equal, sort by pod name then container name
        const podCompare = a.podName.localeCompare(b.podName);
        if (podCompare !== 0) {
          return podCompare;
        }
        
        // If pod names are also equal, sort by container name
        return a.containerName.localeCompare(b.containerName);
      });

      setCombinedLogs(allLogs);
      
      if (errors.length > 0) {
        setError(errors.join('\n'));
      } else {
        setError(null);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
      setError("Failed to fetch logs");
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    if ((isSinglePod && selectedContainer) || (!isSinglePod && selectedPods.length > 0)) {
      fetchLogs();
      
      if (isFollowing) {
        const intervalId = setInterval(fetchLogs, refreshInterval);
        return () => clearInterval(intervalId);
      }
    }
  }, [selectedPods, selectedContainer, isFollowing, tailLines, isSinglePod]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (shouldScrollRef.current && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [combinedLogs]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      // If user is near bottom (within 50px), keep auto-scrolling
      shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  const handlePodSelectionChange = (selected: string[]) => {
    setSelectedPods(selected);
  };

  const handleClearLogs = () => {
    setCombinedLogs([]);
  };

  const handleDownloadLogs = () => {
    const logText = combinedLogs.map(log => {
      const prefix = (showPodNames && !isSinglePod) ? `[${log.podName}/${log.containerName}] ` : '';
      return `${log.timestamp} ${prefix}${log.message}`;
    }).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = isSinglePod 
      ? `${pods[0].metadata.name}-${selectedContainer}-logs-${new Date().getTime()}.txt`
      : `workload-logs-${new Date().getTime()}.txt`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatLogLine = (log: LogEntry): string => {
    const time = new Date(log.timestamp).toLocaleTimeString();
    const prefix = (showPodNames && !isSinglePod) ? `[${log.podName}/${log.containerName}] ` : '';
    return `${time} ${prefix}${log.message}`;
  };

  const getPodColor = (podName: string): string => {
    // Generate a consistent color for each pod
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#14B8A6', // teal
      '#F97316', // orange
    ];
    
    const index = pods.findIndex(pod => pod.metadata.name === podName);
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Controls */}
      <div className="flex-shrink-0 p-2">
        {/* Container selection for single pod mode */}
        {isSinglePod && allContainers.length > 1 && (
          <div className="mb-3 flex items-center gap-2">
            <label className="text-sm font-medium text-white">Container:</label>
            <Select
              value={selectedContainer}
              onChange={setSelectedContainer}
              options={allContainers.map(container => ({
                value: container,
                label: container
              }))}
              className="w-48"
            />
          </div>
        )}
        
        {/* Other controls */}
        <div className="flex items-center gap-4">
          {/* Pod selection for multi-pod mode */}
          {!isSinglePod && (
            <Select<string>
              value={selectedPods}
              onChange={handlePodSelectionChange}
              options={pods.map(pod => ({
                value: pod.metadata.name,
                label: pod.metadata.name
              }))}
              placeholder="Select pods"
              multiple={true}
              className="w-64"
            />
          )}

          <Select
            value={tailLines}
            onChange={setTailLines}
            options={[
              { value: 100, label: '100 lines' },
              { value: 500, label: '500 lines' },
              { value: 1000, label: '1000 lines' }
            ]}
            className="w-32"
          />

          {!isSinglePod && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPodNames}
                onChange={(e) => setShowPodNames(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-white">Show pod names</span>
            </label>
          )}

          <Button
            variant="secondary"
            onClick={() => setIsFollowing(!isFollowing)}
            className={isFollowing ? 'bg-green-600/30 hover:bg-green-700/30' : ''}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>

          <Button variant="secondary" onClick={fetchLogs}>
            Refresh
          </Button>

          <Button variant="secondary" onClick={handleClearLogs}>
            Clear
          </Button>

          <Button variant="secondary" onClick={handleDownloadLogs}>
            Download
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex-shrink-0 mx-2 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-wrap">
          {error}
        </div>
      )}

      {/* Log display */}
      <div 
        ref={logContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-auto bg-[#101010] text-zinc-400 p-4 font-mono text-sm whitespace-pre-wrap"
      >
        {combinedLogs.length === 0 ? (
          <div className="text-zinc-500">
            {selectedPods.length === 0 ? 'No pods selected' : 'No logs available...'}
          </div>
        ) : (
          combinedLogs.map((log, index) => (
            <div 
              key={index}
              style={{ 
                color: (showPodNames && !isSinglePod) ? getPodColor(log.podName) : undefined 
              }}
            >
              {formatLogLine(log)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};