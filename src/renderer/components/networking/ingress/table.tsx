import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { getHosts, getPaths, getTLS } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { IngressResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  ingresses: k8s.V1IngressList
}

export const IngressList = ({ ingresses }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Hosts', 'Paths', 'TLS'];

  const filteredIngresses = activeNamespace === "all" 
  ? ingresses.items 
  : ingresses.items.filter(ingress => ingress.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredIngresses.map(ingress => ({
    Name: ingress.metadata.name,
    Namespace: ingress.metadata.namespace,
    Hosts: getHosts(ingress),
    Paths: getPaths(ingress),
    TLS: getTLS(ingress),
    _ingress: ingress // Keep reference to original ingress
  }));

  // Sort the data rows
  const sortedIngresses = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedIngresses.map(row => {
    const ingress = row._ingress;
    return {
      Name: <IngressResourceLink name={ingress.metadata.name} namespace={ingress.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={ingress.metadata.namespace} />,
      Hosts: getHosts(ingress),
      Paths: getPaths(ingress),
      TLS: getTLS(ingress)
    };
  });

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  )
}