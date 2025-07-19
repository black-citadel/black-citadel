import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { CSIDriverResourceLink } from './resource-link';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface CSIDriverListProps {
  csiDrivers: k8s.V1CSIDriverList;
}

export const CSIDriverList = ({ csiDrivers }: CSIDriverListProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Attachment Required', 'Pod Info on Mount', 'Volume Lifecycle Modes', 'Storage Capacity', 'Token Requests', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = csiDrivers.items.map(driver => ({
    Name: driver.metadata.name,
    'Attachment Required': driver.spec?.attachRequired === true ? 'Yes' : driver.spec?.attachRequired === false ? 'No' : '-',
    'Pod Info on Mount': driver.spec?.podInfoOnMount === true ? 'Yes' : driver.spec?.podInfoOnMount === false ? 'No' : '-',
    'Volume Lifecycle Modes': formatVolumeLifecycleModes(driver.spec?.volumeLifecycleModes),
    'Storage Capacity': driver.spec?.storageCapacity === true ? 'Yes' : driver.spec?.storageCapacity === false ? 'No' : '-',
    'Token Requests': driver.spec?.tokenRequests?.length || 0,
    Age: driver.metadata.creationTimestamp 
      ? new Date(driver.metadata.creationTimestamp).getTime()
      : 0,
    _driver: driver // Keep reference to original driver
  }));

  // Sort the data rows
  const sortedDrivers = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedDrivers.map(row => {
    const driver = row._driver;
    return {
      Name: <CSIDriverResourceLink name={driver.metadata.name} />,
      'Attachment Required': formatBooleanValue(driver.spec?.attachRequired),
      'Pod Info on Mount': formatBooleanValue(driver.spec?.podInfoOnMount),
      'Volume Lifecycle Modes': formatVolumeLifecycleModes(driver.spec?.volumeLifecycleModes),
      'Storage Capacity': formatBooleanValue(driver.spec?.storageCapacity),
      'Token Requests': formatTokenRequests(driver.spec?.tokenRequests),
      Age: driver.metadata.creationTimestamp 
        ? calculateAge(new Date(driver.metadata.creationTimestamp))
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
  if (value === undefined) return <span className="text-gray-600">-</span>;
  return value ? 
    <span className="text-green-600">Yes</span> : 
    <span className="text-red-600">No</span>;
};

// Helper function to format volume lifecycle modes
const formatVolumeLifecycleModes = (modes: string[] | undefined): string => {
  if (!modes || modes.length === 0) return '-';
  return modes.join(', ');
};

// Helper function to format token requests
const formatTokenRequests = (requests: k8s.StorageV1TokenRequest[] | undefined): string => {
  if (!requests || requests.length === 0) return '-';
  return `${requests.length} request(s)`;
};