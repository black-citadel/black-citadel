import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge, getReplicaStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { StatefulSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  statefulSets: k8s.V1StatefulSetList
}

export const StatefulSetList = ({ statefulSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Ready', 'Age'];

  const filteredStatefulSets = activeNamespace === "all" 
  ? statefulSets.items 
  : statefulSets.items.filter(statefulSet => statefulSet.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredStatefulSets.map(statefulSet => ({
    Name: statefulSet.metadata.name,
    Namespace: statefulSet.metadata.namespace,
    Ready: `${statefulSet.status.readyReplicas || 0}/${statefulSet.status.replicas || 0}`,
    Age: statefulSet.metadata.creationTimestamp,
    _resource: statefulSet // Keep reference to original resource
  }));

  // Sort the data rows
  const sortedStatefulSets = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedStatefulSets.map(row => {
    const statefulSet = row._resource;
    return {
      Name: <StatefulSetResourceLink name={statefulSet.metadata.name} namespace={statefulSet.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={statefulSet.metadata.namespace} />,
      Ready: getReplicaStatus(statefulSet.status.readyReplicas || 0, statefulSet.status.replicas),
      Age: calculateAge(statefulSet.metadata.creationTimestamp)
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