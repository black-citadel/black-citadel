import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { VolumeAttachmentResourceLink } from './resource-link';

interface VolumeAttachmentListProps {
  volumeAttachments: k8s.V1VolumeAttachmentList;
}

export const VolumeAttachmentList = ({ volumeAttachments }: VolumeAttachmentListProps): JSX.Element => {
  const headers = ['Name', 'Attached', 'PV Name', 'Node Name', 'Attacher', 'Age'];

  const processedRows = volumeAttachments.items.map(va => ({
    Name: <VolumeAttachmentResourceLink name={va.metadata.name} />,
    Attached: formatAttachmentStatus(va.status?.attached),
    'PV Name': formatPVName(va.spec.source),
    'Node Name': va.spec.nodeName,
    Attacher: va.spec.attacher,
    Age: va.metadata.creationTimestamp 
      ? calculateAge(new Date(va.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format attachment status
const formatAttachmentStatus = (attached: boolean | undefined): JSX.Element => {
  if (attached === undefined) return <span className="text-gray-600">Unknown</span>;
  return attached ? 
    <span className="text-green-600">Yes</span> : 
    <span className="text-red-600">No</span>;
};

// Helper function to format PV name
const formatPVName = (source: k8s.V1VolumeAttachmentSource): string => {
  if (source.persistentVolumeName) {
    return source.persistentVolumeName;
  } else if (source.inlineVolumeSpec) {
    return 'Inline Volume';
  }
  return 'Unknown';
};