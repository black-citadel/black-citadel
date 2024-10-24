import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PersistentVolumeClaimResourceLink } from './resource-link';
import { PersistentVolumeResourceLink } from '@components/storage/persistent-volume/resource-link';
import { StorageClassResourceLink } from '@components/storage/storage-class/resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  pvcs: k8s.V1PersistentVolumeClaimList;
}

export const PersistentVolumeClaimList = ({ pvcs }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Volume', 'Storage Class', 'Capacity', 'Access Modes', 'Status', 'Age'];

  const filteredPVCs = activeNamespace === "all" 
  ? pvcs.items 
  : pvcs.items.filter(pvc => pvc.metadata.namespace === activeNamespace);

  const processedRows = filteredPVCs.map(pvc => ({
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
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format status
const formatStatus = (phase: string | undefined): JSX.Element => {
  if (!phase) return <span>Unknown</span>;
  
  let color;
  switch (phase.toLowerCase()) {
    case 'bound':
      color = 'text-green-600';
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