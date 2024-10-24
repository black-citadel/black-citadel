import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { StorageClassResourceLink } from './resource-link';

interface Props {
  storageClasses: k8s.V1StorageClassList;
}

export const StorageClassList = ({ storageClasses }: Props): JSX.Element => {
  const headers = ['Name', 'Provisioner', 'Reclaim Policy', 'Volume Binding Mode', 'Allow Volume Expansion', 'Default', 'Age'];

  const processedRows = storageClasses.items.map(sc => ({
    Name: <StorageClassResourceLink name={sc.metadata.name} />,
    Provisioner: sc.provisioner,
    'Reclaim Policy': sc.reclaimPolicy || 'Delete',
    'Volume Binding Mode': sc.volumeBindingMode || 'Immediate',
    'Allow Volume Expansion': formatBooleanValue(sc.allowVolumeExpansion),
    Default: formatDefaultClass(sc.metadata.annotations),
    Age: sc.metadata.creationTimestamp 
      ? calculateAge(new Date(sc.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format boolean values
const formatBooleanValue = (value: boolean | undefined): JSX.Element => {
  if (value === undefined) return <span>-</span>;
  return value ? 
    <span>Yes</span> : 
    <span>No</span>;
};

// Helper function to determine if the storage class is default
const formatDefaultClass = (annotations: { [key: string]: string } | undefined): JSX.Element => {
  const isDefault = annotations && 
    (annotations['storageclass.kubernetes.io/is-default-class'] === 'true' ||
     annotations['storageclass.beta.kubernetes.io/is-default-class'] === 'true');
  
  return isDefault ? 
    <span>Yes</span> : 
    <span></span>;
};