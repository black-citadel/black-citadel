import { useState, useEffect } from 'react';
import { Subheading } from '@components/base/heading';
import { ListHeader } from '@components/list-header';
import { MCPConnection, MCPToolCallHistory } from '@utils/types';
import { MCPConnectionList } from '@components/operations/mcp-server/table';
import { Resources } from '@utils/enums';
import { EmptyState } from '@components/base/empty-state';

export const MCPServerListView = (): JSX.Element => {
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [history, setHistory] = useState<MCPToolCallHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <ListHeader
        resource={Resources.MCPServer}
        error={error}
        showNamespaceDropdown={false}
      />

      <div className="mx-auto my-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div key="server_status" className="px-4 py-4 border-zinc-900 border rounded-md">
            <p className="text-sm font-medium text-gray-400">Server status</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="font-semibold tracking-tight text-green-500">Running (Port: 3333)</span>
            </p>
          </div>

          <div key="active_connections" className="px-4 py-4 border-zinc-900 border rounded-md">
            <p className="text-sm font-medium text-gray-400">Active Connections</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="font-semibold tracking-tight text-white">{connections.length}</span>
            </p>
          </div>

          <div key="tools_used" className="px-4 py-4 border-zinc-900 border rounded-md">
            <p className="text-sm font-medium text-gray-400">Tools Used</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="font-semibold tracking-tight text-white">{history.length}</span>
            </p>
          </div>
        </div>
      </div>

      <Subheading className="mb-4">Active Connections</Subheading>
      
      {connections.length === 0 ? (
        <EmptyState
          title="No active MCP connections"
          description="AI agents can connect to http://localhost:3333/mcp using Streamable HTTP."
        />
      ) : (
        <MCPConnectionList connections={connections} />
      )}
    </>
  );
};