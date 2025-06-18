import { useState, useEffect } from 'react';
import { Heading, Subheading } from '@components/base/heading';
import { Text } from '@components/base/text';
import { Badge } from '@components/base/badge';
import { Button } from '@components/base/button';
import { ListHeader } from '@components/list-header';
import { MCPConnection, MCPToolCallHistory } from '@utils/types';
import { formatDistanceToNow } from 'date-fns';
import { MCPConnectionList } from '@components/operations/mcp-server/table';
import { Resources } from '@utils/enums';

export const MCPServerListView = (): JSX.Element => {
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [history, setHistory] = useState<MCPToolCallHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const fetchData = async () => {
    try {
      const [connectionsData, historyData] = await Promise.all([
        window.electronAPI.getMCPConnections(),
        window.electronAPI.getMCPToolCallHistory(100) // Last 100 calls
      ]);
      
      setConnections(connectionsData);
      setHistory(historyData);
      setError(null);
    } catch (e) {
      console.error('Failed to fetch MCP data:', e);
      setError('Failed to fetch MCP data');
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear the tool call history?')) {
      await window.electronAPI.clearMCPToolCallHistory();
      await fetchData();
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatJson = (obj: any) => {
    if (!obj || typeof obj === 'string') return obj || '-';
    return JSON.stringify(obj, null, 2);
  };

  const renderOverview = () => (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Server Status</Text>
            <div className="flex items-center mt-2">
              <Badge color="green">Running</Badge>
              <Text size="sm" className="ml-2">Port 3333</Text>
            </div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Active Connections</Text>
            <Text size="2xl" className="mt-2 font-semibold">{connections.length}</Text>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Total Tool Calls</Text>
            <Text size="2xl" className="mt-2 font-semibold">{history.length}</Text>
          </div>
        </div>
      </div>

      <Subheading className="mb-4">Active Connections</Subheading>
      {connections.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-lg text-center">
          <Text className="text-zinc-400">No active MCP connections</Text>
          <Text size="sm" className="text-zinc-500 mt-2">
            AI agents can connect to http://localhost:3333/mcp
          </Text>
        </div>
      ) : (
        <MCPConnectionList connections={connections} />
      )}
    </>
  );

  const renderHistory = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <Subheading>Tool Call History</Subheading>
        {history.length > 0 && (
          <Button onClick={handleClearHistory} variant="secondary" size="sm">
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-lg text-center">
          <Text className="text-zinc-400">No tool calls yet</Text>
          <Text size="sm" className="text-zinc-500 mt-2">
            Tool calls will appear here as AI agents interact with the MCP server
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((call) => (
            <div key={call.id} className="bg-zinc-900 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Text className="font-medium">{call.toolName}</Text>
                  <Text size="sm" className="text-zinc-400">
                    {formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={call.status === 'success' ? 'green' : 'red'}>
                    {call.status}
                  </Badge>
                  <Badge color="gray">{formatDuration(call.duration)}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text size="sm" className="text-zinc-400 mb-1">Input</Text>
                  <pre className="bg-zinc-800 p-2 rounded text-xs overflow-auto max-h-32">
                    {formatJson(call.input)}
                  </pre>
                </div>
                <div>
                  <Text size="sm" className="text-zinc-400 mb-1">
                    {call.status === 'success' ? 'Output' : 'Error'}
                  </Text>
                  <pre className="bg-zinc-800 p-2 rounded text-xs overflow-auto max-h-32">
                    {call.status === 'success' ? formatJson(call.output) : call.error}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <ListHeader 
        resource={Resources.MCPServer}
        error={error}
        showNamespaceDropdown={false}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab('overview')}
              outline
            >
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab('history')}
              outline
            >
              History
            </Button>
          </div>
        }
      />

      <div className="m-2">
        {activeTab === 'overview' ? renderOverview() : renderHistory()}
      </div>
    </>
  );
};