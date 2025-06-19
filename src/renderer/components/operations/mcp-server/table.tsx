import { ListTable } from '@components/list-table';
import { MCPConnection } from '@utils/types';
import { MCPConnectionResourceLink } from './resource-link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@components/base/badge';
import { useState } from 'react';

interface Props {
  connections: MCPConnection[];
}

export const MCPConnectionList = ({ connections }: Props): JSX.Element => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const headers = ['Name', 'Session ID', 'Status', 'Connected', 'Last Activity', 'Tools Used'];

  const sortedConnections = [...connections].sort((a, b) => {
    if (!sortDirection) return 0;
    const nameA = (a.agentName || a.id).toLowerCase();
    const nameB = (b.agentName || b.id).toLowerCase();
    return sortDirection === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const processedRows = sortedConnections.map(connection => ({
    'Name': <MCPConnectionResourceLink connectionId={connection.id} agentName={connection.agentName} />,
    'Session ID': <>{connection.id}</>,
    'Status': <Badge color="green">Active</Badge>,
    'Connected': formatDistanceToNow(new Date(connection.connectedAt), { addSuffix: true }),
    'Last Activity': formatDistanceToNow(new Date(connection.lastActivity), { addSuffix: true }),
    'Tools Used': connection.toolsUsed
  }));

  return (
    <ListTable
      headers={headers}
      rows={processedRows}
      sortDirection={sortDirection}
      onSort={setSortDirection}
    />
  );
};