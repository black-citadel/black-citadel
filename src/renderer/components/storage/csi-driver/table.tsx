import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { CSIDriverResourceLink } from './resource-link';

interface CSIDriverListProps {
  csiDrivers: k8s.V1CSIDriverList;
}

export const CSIDriverList = ({ csiDrivers }: CSIDriverListProps): JSX.Element => {
  const headers = ['Name', 'Attachment Required', 'Pod Info on Mount', 'Volume Lifecycle Modes', 'Storage Capacity', 'Token Requests', 'Age'];

  const processedRows = csiDrivers.items.map(driver => ({
    Name: <CSIDriverResourceLink name={driver.metadata.name} />,
    'Attachment Required': formatBooleanValue(driver.spec?.attachRequired),
    'Pod Info on Mount': formatBooleanValue(driver.spec?.podInfoOnMount),
    'Volume Lifecycle Modes': formatVolumeLifecycleModes(driver.spec?.volumeLifecycleModes),
    'Storage Capacity': formatBooleanValue(driver.spec?.storageCapacity),
    'Token Requests': formatTokenRequests(driver.spec?.tokenRequests),
    Age: driver.metadata.creationTimestamp 
      ? calculateAge(new Date(driver.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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