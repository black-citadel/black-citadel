import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface EndpointPortsProps {
  ports: k8s.CoreV1EndpointPort[]
}

export const EndpointPorts = ({ ports }: EndpointPortsProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Port', 'Protocol', 'App Protocol'];
  
  // Create data rows with raw values for sorting
  const dataRows = ports.map((port, index) => ({
    Name: port.name || '',
    Port: port.port,
    Protocol: port.protocol || '',
    'App Protocol': port.appProtocol || '',
    _port: port,
    _key: port.name || `port-${index}`
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => {
    const port = row._port;
    return {
      Name: port.name || '-',
      Port: port.port,
      Protocol: port.protocol || 'TCP',
      'App Protocol': port.appProtocol || '-'
    };
  });

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
}