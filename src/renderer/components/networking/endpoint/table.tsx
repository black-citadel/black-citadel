import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { EndpointResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  endpoints: k8s.V1EndpointsList
}

export const EndpointsList = ({ endpoints }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Endpoints', 'Age'];

  const filteredEndpoints = activeNamespace === "all" 
  ? endpoints.items 
  : endpoints.items.filter(endpoint => endpoint.metadata.namespace === activeNamespace);

  const processedRows = filteredEndpoints.map(endpoint => ({
    Name: <EndpointResourceLink name={endpoint.metadata.name} namespace={endpoint.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={endpoint.metadata.namespace} />,
    Endpoints: formatEndpoints(endpoint.subsets),
    Age: endpoint.metadata.creationTimestamp 
      ? calculateAge(new Date(endpoint.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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