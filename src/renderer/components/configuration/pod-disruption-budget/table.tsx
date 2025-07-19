import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PodDisruptionBudgetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  pdbs: k8s.V1PodDisruptionBudgetList;
}

export const PodDisruptionBudgetList = ({ pdbs }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Min Available', 'Max Unavailable', 'Allowed Disruptions', 'Current', 'Desired', 'Total', 'Age'];

  const filteredPDBs = activeNamespace === "all" 
  ? pdbs.items 
  : pdbs.items.filter(pdb => pdb.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredPDBs.map(pdb => ({
    Name: pdb.metadata.name,
    Namespace: pdb.metadata.namespace,
    'Min Available': typeof pdb.spec?.minAvailable === 'number' ? pdb.spec.minAvailable : 0,
    'Max Unavailable': typeof pdb.spec?.maxUnavailable === 'number' ? pdb.spec.maxUnavailable : 0,
    'Allowed Disruptions': pdb.status?.disruptionsAllowed || 0,
    Current: pdb.status?.currentHealthy || 0,
    Desired: pdb.status?.desiredHealthy || 0,
    Total: pdb.status?.expectedPods || 0,
    Age: pdb.metadata.creationTimestamp 
      ? new Date(pdb.metadata.creationTimestamp).getTime()
      : 0,
    _pdb: pdb // Keep reference to original pdb
  }));

  // Sort the data rows
  const sortedPDBs = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedPDBs.map(row => {
    const pdb = row._pdb;
    return {
      Name: <PodDisruptionBudgetResourceLink name={pdb.metadata.name} namespace={pdb.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={pdb.metadata.namespace} />,
      'Min Available': pdb.spec?.minAvailable || '-',
      'Max Unavailable': pdb.spec?.maxUnavailable || '-',
      'Allowed Disruptions': pdb.status?.disruptionsAllowed || '-',
      Current: pdb.status?.currentHealthy || '-',
      Desired: pdb.status?.desiredHealthy || '-',
      Total: pdb.status?.expectedPods || '-',
      Age: pdb.metadata.creationTimestamp 
        ? calculateAge(new Date(pdb.metadata.creationTimestamp))
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