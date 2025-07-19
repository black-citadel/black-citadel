import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { PersistentVolumeResourceLink } from './resource-link';
import { StorageClassResourceLink } from '@components/storage/storage-class/resource-link';
import { PersistentVolumeClaimResourceLink } from '@components/storage/persistent-volume-claim/resource-link';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  pvs: k8s.V1PersistentVolumeList;
}

export const PersistentVolumeList = ({ pvs }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Storage Class', 'Claim', 'Capacity', 'Access Modes', 'Reclaim Policy', 'Reason', 'Status', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = pvs.items.map(pv => ({
    Name: pv.metadata.name,
    'Storage Class': pv.spec?.storageClassName || '-',
    Claim: pv.spec?.claimRef ? `${pv.spec.claimRef.namespace}/${pv.spec.claimRef.name}` : '-',
    Capacity: parseCapacity(pv.spec?.capacity?.storage || '-'),
    'Access Modes': formatAccessModes(pv.spec?.accessModes),
    'Reclaim Policy': pv.spec?.persistentVolumeReclaimPolicy || '-',
    Reason: pv.status?.reason || '-',
    Status: pv.status?.phase || 'Unknown',
    Age: pv.metadata.creationTimestamp 
      ? new Date(pv.metadata.creationTimestamp).getTime()
      : 0,
    _pv: pv // Keep reference to original pv
  }));

  // Sort the data rows
  const sortedPVs = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedPVs.map(row => {
    const pv = row._pv;
    return {
      Name: <PersistentVolumeResourceLink name={pv.metadata.name} />,
      'Storage Class': pv.spec?.storageClassName ? <StorageClassResourceLink name={pv.spec.storageClassName } /> : '-',
      Claim: pv.spec?.claimRef ? <PersistentVolumeClaimResourceLink name={pv.spec.claimRef.name} namespace={pv.spec.claimRef.namespace} /> : '-',
      Capacity: pv.spec?.capacity?.storage || '-',
      'Access Modes': formatAccessModes(pv.spec?.accessModes),
      'Reclaim Policy': pv.spec?.persistentVolumeReclaimPolicy || '-',
      Reason: pv.status?.reason || '-',
      Status: formatStatus(pv.status?.phase),
      Age: pv.metadata.creationTimestamp 
        ? calculateAge(new Date(pv.metadata.creationTimestamp))
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

// Helper function to format status
const formatStatus = (phase: string | undefined): JSX.Element => {
  if (!phase) return <span>Unknown</span>;
  
  let color;
  switch (phase.toLowerCase()) {
    case 'available':
      color = 'text-green-500';
      break;
    case 'bound':
      color = 'text-blue-600';
      break;
    case 'released':
      color = 'text-yellow-600';
      break;
    case 'failed':
      color = 'text-red-600';
      break;
    default:
      color = 'text-gray-600';
  }

  return <span className={color}>{phase}</span>;
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