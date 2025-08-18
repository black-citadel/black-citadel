import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PersistentVolumeClaimResourceLink } from './resource-link';
import { PersistentVolumeResourceLink } from '@components/storage/persistent-volume/resource-link';
import { StorageClassResourceLink } from '@components/storage/storage-class/resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  pvcs: k8s.V1PersistentVolumeClaimList;
}

export const PersistentVolumeClaimList = ({ pvcs }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Volume', 'Storage Class', 'Capacity', 'Access Modes', 'Status', 'Age'];

  const filteredPVCs = activeNamespace === "all" 
  ? pvcs.items 
  : pvcs.items.filter(pvc => pvc.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredPVCs.map(pvc => ({
    Name: pvc.metadata.name,
    Namespace: pvc.metadata.namespace,
    Volume: pvc.spec?.volumeName || '-',
    'Storage Class': pvc.spec?.storageClassName || '-',
    Capacity: parseCapacity(pvc.status?.capacity?.storage || pvc.spec?.resources?.requests?.storage || '-'),
    'Access Modes': formatAccessModes(pvc.spec?.accessModes),
    Status: pvc.status?.phase || 'Unknown',
    Age: pvc.metadata.creationTimestamp 
      ? new Date(pvc.metadata.creationTimestamp).getTime()
      : 0,
    _pvc: pvc // Keep reference to original pvc
  }));

  // Sort the data rows
  const sortedPVCs = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedPVCs.map(row => {
    const pvc = row._pvc;
    return {
      Name: <PersistentVolumeClaimResourceLink name={pvc.metadata.name} namespace={pvc.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={pvc.metadata.namespace} />,
      Volume: pvc.spec?.volumeName ? <PersistentVolumeResourceLink name={pvc.spec.volumeName} /> : '-',
      'Storage Class': pvc.spec?.storageClassName ? <StorageClassResourceLink name={pvc.spec.storageClassName } /> : '-',
      Capacity: pvc.status?.capacity?.storage || pvc.spec?.resources?.requests?.storage || '-',
      'Access Modes': formatAccessModes(pvc.spec?.accessModes),
      Status: formatStatus(pvc.status?.phase),
      Age: pvc.metadata.creationTimestamp 
        ? calculateAge(new Date(pvc.metadata.creationTimestamp))
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

// Helper function to format status
const formatStatus = (phase: string | undefined): JSX.Element => {
  if (!phase) return <span>Unknown</span>;
  
  let color;
  switch (phase.toLowerCase()) {
    case 'bound':
      color = 'text-green-500';
      break;
    case 'pending':
      color = 'text-yellow-600';
      break;
    case 'lost':
      color = 'text-red-600';
      break;
    default:
      color = 'text-gray-600';
  }

  return <span className={color}>{phase}</span>;
};

// Helper function to format access modes
const formatAccessModes = (accessModes: string[] | undefined): string => {
  if (!accessModes || accessModes.length === 0) return '-';

  const modeAbbreviations: { [key: string]: string } = {
    'ReadWriteOnce': 'RWO',
    'ReadOnlyMany': 'ROX',
    'ReadWriteMany': 'RWX',
    'ReadWriteOncePod': 'RWOP'
  };

  return accessModes.map(mode => modeAbbreviations[mode] || mode).join(', ');
};

// Helper function to parse capacity for sorting
const parseCapacity = (capacity: string): number => {
  if (!capacity || capacity === '-') return 0;
  
  const units: { [key: string]: number } = {
    'Ki': 1024,
    'Mi': 1024 * 1024,
    'Gi': 1024 * 1024 * 1024,
    'Ti': 1024 * 1024 * 1024 * 1024,
    'Pi': 1024 * 1024 * 1024 * 1024 * 1024,
    'K': 1000,
    'M': 1000 * 1000,
    'G': 1000 * 1000 * 1000,
    'T': 1000 * 1000 * 1000 * 1000,
    'P': 1000 * 1000 * 1000 * 1000 * 1000
  };
  
  const match = capacity.match(/^(\d+(?:\.\d+)?)\s*([KMGTP]i?)?$/);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2] || '';
    return value * (units[unit] || 1);
  }
  
  return 0;
};