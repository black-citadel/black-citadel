import { useState, useEffect } from 'react';
import { Heading, Subheading } from '@components/base/heading';
import { DetailsHeader } from '@components/details-header';
import { MCPBadge } from '@components/operations/mcp-server/badge';
import { Badge } from '@components/base/badge';
import { Text } from '@components/base/text';
import { MCPConnection, MCPToolCallHistory } from '@utils/types';
import { useView } from '@context/viewProvider';
import { format, formatDistanceToNow } from 'date-fns';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';

export const MCPServerDetailsView = (): JSX.Element => {
  const { viewContext } = useView();
  const [connection, setConnection] = useState<MCPConnection | null>(null);
  const [history, setHistory] = useState<MCPToolCallHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');

  const fetchData = async () => {
    try {
      // Get all connections and find the one we're viewing
      const connections = await window.electronAPI.getMCPConnections();
      const currentConnection = connections.find(c => c.id === viewContext.name);
      
      if (currentConnection) {
        setConnection(currentConnection);
        
        // Get history for this connection
        const allHistory = await window.electronAPI.getMCPToolCallHistory();
        const connectionHistory = allHistory.filter(h => h.connectionId === viewContext.name);
        setHistory(connectionHistory);
      } else {
        setError('Connection not found');
      }
    } catch (e) {
      console.error('Failed to fetch connection details:', e);
      setError('Failed to fetch connection details');
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [viewContext.name]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatJson = (obj: any) => {
    if (!obj || typeof obj === 'string') return obj || '-';
    return JSON.stringify(obj, null, 2);
  };

  const renderDetails = () => {
    if (!connection) return null;

    return (
      <div className="m-2">
        <Subheading className="mt-8 mb-4">Connection Information</Subheading>
        <div className="grid grid-cols-2 gap-4">
          <DetailsItem label="Session ID">
            <code className="text-sm">{connection.id}</code>
          </DetailsItem>
          <DetailsItem label="Status">
            <Badge color="green">Active</Badge>
          </DetailsItem>
          <DetailsItem label="Connected">
            {format(new Date(connection.connectedAt), 'PPpp')}
          </DetailsItem>
          <DetailsItem label="Last Activity">
            {format(new Date(connection.lastActivity), 'PPpp')}
          </DetailsItem>
          <DetailsItem label="Total Tool Calls">
            {connection.toolsUsed}
          </DetailsItem>
          <DetailsItem label="Connection Duration">
            {formatDistanceToNow(new Date(connection.connectedAt))}
          </DetailsItem>
        </div>

        <Subheading className="mt-8 mb-4">Statistics</Subheading>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Success Rate</Text>
            <Text size="2xl" className="mt-2 font-semibold">
              {history.length > 0 
                ? `${Math.round((history.filter(h => h.status === 'success').length / history.length) * 100)}%`
                : 'N/A'
              }
            </Text>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Avg Response Time</Text>
            <Text size="2xl" className="mt-2 font-semibold">
              {history.length > 0
                ? formatDuration(history.reduce((sum, h) => sum + h.duration, 0) / history.length)
                : 'N/A'
              }
            </Text>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <Text size="sm" className="text-zinc-400">Most Used Tool</Text>
            <Text size="lg" className="mt-2 font-semibold">
              {history.length > 0
                ? Object.entries(history.reduce((acc, h) => {
                    acc[h.toolName] = (acc[h.toolName] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>))
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                : 'N/A'
              }
            </Text>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    return (
      <div className="m-2">
        <Subheading className="mb-4">Tool Call Timeline</Subheading>
        {history.length === 0 ? (
          <div className="bg-zinc-900 p-8 rounded-lg text-center">
            <Text className="text-zinc-400">No tool calls for this connection</Text>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-700"></div>
            
            {/* Timeline items */}
            <div className="space-y-6">
              {history.map((call, index) => (
                <div key={call.id} className="relative flex">
                  {/* Timeline dot */}
                  <div className={`absolute left-7 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                    call.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  
                  {/* Content */}
                  <div className="ml-16 flex-1">
                    <div className="bg-zinc-900 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Text className="font-medium">{call.toolName}</Text>
                          <Text size="sm" className="text-zinc-400">
                            {format(new Date(call.timestamp), 'HH:mm:ss.SSS')}
                            {' • '}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <MCPBadge />
          <span>{connection?.agentName || `Connection ${viewContext.name?.substring(0, 8)}`}</span>
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem 
              onClick={() => setActiveTab('details')} 
              current={activeTab === 'details'}
            >
              Details
            </NavbarItem>
            <NavbarItem 
              onClick={() => setActiveTab('timeline')} 
              current={activeTab === 'timeline'}
            >
              Timeline
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === 'details' ? renderDetails() : renderTimeline()}
    </>
  );
};