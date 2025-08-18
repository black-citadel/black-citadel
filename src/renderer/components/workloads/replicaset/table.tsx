import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge, getReplicaStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ReplicaSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  replicaSets: k8s.V1ReplicaSetList
}

export const ReplicaSetList = ({ replicaSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Desired', 'Current', 'Ready', 'Age'];

  const filteredResplicaSets = activeNamespace === "all" 
  ? replicaSets.items 
  : replicaSets.items.filter(replicaSet => replicaSet.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredResplicaSets.map(replicaSet => ({
    Name: replicaSet.metadata.name,
    Namespace: replicaSet.metadata.namespace,
    Desired: replicaSet.spec.replicas || 0,
    Current: replicaSet.status.replicas || 0,
    Ready: `${replicaSet.status.readyReplicas || 0}/${replicaSet.status.replicas || 0}`,
    Age: replicaSet.metadata.creationTimestamp,
    _resource: replicaSet // Keep reference to original resource
  }));

  // Sort the data rows
  const sortedReplicaSets = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedReplicaSets.map(row => {
    const replicaSet = row._resource;
    return {
      Name: <ReplicaSetResourceLink name={replicaSet.metadata.name} namespace={replicaSet.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={replicaSet.metadata.namespace} />,
      Desired: replicaSet.spec.replicas,
      Current: replicaSet.status.replicas,
      Ready: getReplicaStatus(replicaSet.status.readyReplicas || 0, replicaSet.status.replicas),
      Age: calculateAge(replicaSet.metadata.creationTimestamp),
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