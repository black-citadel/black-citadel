import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { ServiceBadge } from './badge';
import { PodBadge } from '@components/workloads/pod/badge';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface ServicePortsProps {
  ports: k8s.V1ServicePort[]
}

export const ServicePorts = ({ ports }: ServicePortsProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Port', 'Protocol', 'TargetPort'];
  
  // Create data rows with raw values for sorting
  const dataRows = ports.map((port, index) => ({
    Name: port.name || '',
    Port: port.port,
    Protocol: port.protocol || '',
    TargetPort: port.targetPort?.toString() || '',
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
      Port: <><ServiceBadge />{port.port}</>,
      Protocol: port.protocol || '-',
      TargetPort: <><PodBadge />{port.targetPort}</>
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