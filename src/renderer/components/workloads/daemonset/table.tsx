import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { DaemonSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  daemonSets: k8s.V1DaemonSetList
}

export const DaemonSetList = ({ daemonSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Desired', 'Current', 'Ready', 'Up-to-date', 'Available', 'Age'];

  const filteredDaemonSets = activeNamespace === "all" 
  ? daemonSets.items 
  : daemonSets.items.filter(daemonSet => daemonSet.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredDaemonSets.map(daemonSet => ({
    Name: daemonSet.metadata.name,
    Namespace: daemonSet.metadata.namespace,
    Desired: daemonSet.status.desiredNumberScheduled || 0,
    Current: daemonSet.status.currentNumberScheduled || 0,
    Ready: daemonSet.status.numberReady || 0,
    'Up-to-date': daemonSet.status.updatedNumberScheduled || 0,
    Available: daemonSet.status.numberAvailable || 0,
    Age: daemonSet.metadata.creationTimestamp,
    _resource: daemonSet // Keep reference to original resource
  }));

  // Sort the data rows
  const sortedDaemonSets = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedDaemonSets.map(row => {
    const daemonSet = row._resource;
    return {
      Name: <DaemonSetResourceLink name={daemonSet.metadata.name} namespace={daemonSet.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={daemonSet.metadata.namespace} />,
      Desired: daemonSet.status.desiredNumberScheduled,
      Current: daemonSet.status.currentNumberScheduled,
      Ready: getStatus(daemonSet),
      'Up-to-date': daemonSet.status.updatedNumberScheduled,
      Available: daemonSet.status.numberAvailable,
      Age: calculateAge(daemonSet.metadata.creationTimestamp)
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