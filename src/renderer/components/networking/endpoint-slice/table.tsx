import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { EndpointSliceResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface EndpointSliceListProps {
  endpointSlices: k8s.V1EndpointSliceList;
}

export const EndpointSliceList = ({ endpointSlices }: EndpointSliceListProps): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Endpoints', 'Ports', 'AddressType', 'Age'];

  const filteredEndpointSlices = activeNamespace === "all" 
  ? endpointSlices.items 
  : endpointSlices.items.filter(endpointSlice => endpointSlice.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredEndpointSlices.map(endpointSlice => ({
    Name: endpointSlice.metadata.name,
    Namespace: endpointSlice.metadata.namespace,
    Endpoints: endpointSlice.endpoints?.length || 0,
    Ports: endpointSlice.ports?.length || 0,
    AddressType: endpointSlice.addressType || 'N/A',
    Age: endpointSlice.metadata.creationTimestamp ? new Date(endpointSlice.metadata.creationTimestamp).getTime() : 0,
    _endpointSlice: endpointSlice // Keep reference to original endpoint slice
  }));

  // Sort the data rows
  const sortedEndpointSlices = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedEndpointSlices.map(row => {
    const endpointSlice = row._endpointSlice;
    return {
      Name: <EndpointSliceResourceLink name={endpointSlice.metadata.name} namespace={endpointSlice.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={endpointSlice.metadata.namespace} />,
      Endpoints: formatEndpoints(endpointSlice.endpoints),
      Ports: formatPorts(endpointSlice.ports),
      AddressType: endpointSlice.addressType || 'N/A',
      Age: endpointSlice.metadata.creationTimestamp 
        ? calculateAge(new Date(endpointSlice.metadata.creationTimestamp))
        : 'N/A'
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
};

// Helper function to format endpoints
const formatEndpoints = (endpoints: k8s.V1Endpoint[] | undefined): string => {
  if (!endpoints || endpoints.length === 0) return 'None';

  return endpoints.map(endpoint => 
    endpoint.addresses.join(', ')
  ).join('; ');
};

// Helper function to format ports
const formatPorts = (ports: k8s.DiscoveryV1EndpointPort[] | undefined): string => {
  if (!ports || ports.length === 0) return 'None';

  return ports.map(port => 
    `${port.port}${port.protocol ? '/' + port.protocol : ''}`
  ).join(', ');
};