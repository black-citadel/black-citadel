import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { StorageClassResourceLink } from './resource-link';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  storageClasses: k8s.V1StorageClassList;
}

export const StorageClassList = ({ storageClasses }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Provisioner', 'Reclaim Policy', 'Volume Binding Mode', 'Allow Volume Expansion', 'Default', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = storageClasses.items.map(sc => ({
    Name: sc.metadata.name,
    Provisioner: sc.provisioner,
    'Reclaim Policy': sc.reclaimPolicy || 'Delete',
    'Volume Binding Mode': sc.volumeBindingMode || 'Immediate',
    'Allow Volume Expansion': sc.allowVolumeExpansion === true ? 'Yes' : 'No',
    Default: isDefaultClass(sc.metadata.annotations) ? 'Yes' : 'No',
    Age: sc.metadata.creationTimestamp 
      ? new Date(sc.metadata.creationTimestamp).getTime()
      : 0,
    _sc: sc // Keep reference to original storage class
  }));

  // Sort the data rows
  const sortedStorageClasses = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedStorageClasses.map(row => {
    const sc = row._sc;
    return {
      Name: <StorageClassResourceLink name={sc.metadata.name} />,
      Provisioner: sc.provisioner,
      'Reclaim Policy': sc.reclaimPolicy || 'Delete',
      'Volume Binding Mode': sc.volumeBindingMode || 'Immediate',
      'Allow Volume Expansion': formatBooleanValue(sc.allowVolumeExpansion),
      Default: formatDefaultClass(sc.metadata.annotations),
      Age: sc.metadata.creationTimestamp 
        ? calculateAge(new Date(sc.metadata.creationTimestamp))
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

// Helper function to format boolean values
const formatBooleanValue = (value: boolean | undefined): JSX.Element => {
  if (value === undefined) return <span>-</span>;
  return value ? 
    <span>Yes</span> : 
    <span>No</span>;
};

// Helper function to determine if the storage class is default
const formatDefaultClass = (annotations: { [key: string]: string } | undefined): JSX.Element => {
  const isDefault = isDefaultClass(annotations);
  
  return isDefault ? 
    <span>Yes</span> : 
    <span></span>;
};

// Helper function to check if storage class is default (for sorting)
const isDefaultClass = (annotations: { [key: string]: string } | undefined): boolean => {
  return annotations && 
    (annotations['storageclass.kubernetes.io/is-default-class'] === 'true' ||
     annotations['storageclass.beta.kubernetes.io/is-default-class'] === 'true') || false;
};