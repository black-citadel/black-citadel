import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { PersistentVolumeResourceLink } from './resource-link';
import { StorageClassResourceLink } from '@components/storage/storage-class/resource-link';
import { PersistentVolumeClaimResourceLink } from '@components/storage/persistent-volume-claim/resource-link';

interface Props {
  pvs: k8s.V1PersistentVolumeList;
}

export const PersistentVolumeList = ({ pvs }: Props): JSX.Element => {
  const headers = ['Name', 'Storage Class', 'Claim', 'Capacity', 'Access Modes', 'Reclaim Policy', 'Reason', 'Status', 'Age'];

  const processedRows = pvs.items.map(pv => ({
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
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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