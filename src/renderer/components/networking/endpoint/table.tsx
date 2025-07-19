import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { EndpointResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  endpoints: k8s.V1EndpointsList
}

export const EndpointsList = ({ endpoints }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Endpoints', 'Age'];

  const filteredEndpoints = activeNamespace === "all" 
  ? endpoints.items 
  : endpoints.items.filter(endpoint => endpoint.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredEndpoints.map(endpoint => ({
    Name: endpoint.metadata.name,
    Namespace: endpoint.metadata.namespace,
    Endpoints: countEndpoints(endpoint.subsets),
    Age: endpoint.metadata.creationTimestamp ? new Date(endpoint.metadata.creationTimestamp).getTime() : 0,
    _endpoint: endpoint // Keep reference to original endpoint
  }));

  // Sort the data rows
  const sortedEndpoints = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedEndpoints.map(row => {
    const endpoint = row._endpoint;
    return {
      Name: <EndpointResourceLink name={endpoint.metadata.name} namespace={endpoint.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={endpoint.metadata.namespace} />,
      Endpoints: formatEndpoints(endpoint.subsets),
      Age: endpoint.metadata.creationTimestamp 
        ? calculateAge(new Date(endpoint.metadata.creationTimestamp))
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

// Helper function to count endpoints for sorting
const countEndpoints = (subsets: k8s.V1EndpointSubset[] | undefined): number => {
  if (!subsets || subsets.length === 0) return 0;

  return subsets.reduce((count, subset) => 
    count + (subset.addresses || []).length * (subset.ports || [{ port: 0 }]).length,
    0
  );
};

// Helper function to format endpoints
const formatEndpoints = (subsets: k8s.V1EndpointSubset[] | undefined): string => {
  if (!subsets || subsets.length === 0) return 'None';

  const endpointStrings = subsets.flatMap(subset => 
    (subset.addresses || []).flatMap(address => 
      (subset.ports || []).map(port => 
        `${address.ip}:${port.port}`
      )
    )
  );

  return endpointStrings.join(', ');
};