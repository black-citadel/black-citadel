import { useState } from 'react';
import { ListTable, type SortConfig } from '@protoku/design-system';
import { MCPConnection } from '@utils/types';
import { MCPConnectionResourceLink } from './resource-link';
import { formatDistanceToNow } from 'date-fns';
import { Status } from '@protoku/design-system';
import { sortRows } from '@utils/sorting';

interface Props {
  connections: MCPConnection[];
}

export const MCPConnectionList = ({ connections }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Session ID', 'Status', 'Connected', 'Last Activity', 'Tools Used'];

  // Create data rows with raw values for sorting
  const dataRows = connections.map(connection => ({
    Name: connection.agentName || connection.id,
    'Session ID': connection.id,
    Status: 'Active',
    Connected: connection.connectedAt,
    'Last Activity': connection.lastActivity,
    'Tools Used': connection.toolsUsed,
    _raw: connection
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to React components
  const processedRows = sortedRows.map(row => ({
    'Name': <MCPConnectionResourceLink connectionId={row._raw.id} agentName={row._raw.agentName} />,
    'Session ID': <>{row._raw.id}</>,
    'Status': <Status variant="success">Active</Status>,
    'Connected': formatDistanceToNow(new Date(row._raw.connectedAt), { addSuffix: true }),
    'Last Activity': formatDistanceToNow(new Date(row._raw.lastActivity), { addSuffix: true }),
    'Tools Used': row._raw.toolsUsed
  }));

  return (
    <ListTable
      headers={headers}
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};