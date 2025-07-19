import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { VolumeAttachmentResourceLink } from './resource-link';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface VolumeAttachmentListProps {
  volumeAttachments: k8s.V1VolumeAttachmentList;
}

export const VolumeAttachmentList = ({ volumeAttachments }: VolumeAttachmentListProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Attached', 'PV Name', 'Node Name', 'Attacher', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = volumeAttachments.items.map(va => ({
    Name: va.metadata.name,
    Attached: va.status?.attached === true ? 'Yes' : va.status?.attached === false ? 'No' : 'Unknown',
    'PV Name': formatPVName(va.spec.source),
    'Node Name': va.spec.nodeName,
    Attacher: va.spec.attacher,
    Age: va.metadata.creationTimestamp 
      ? new Date(va.metadata.creationTimestamp).getTime()
      : 0,
    _va: va // Keep reference to original volume attachment
  }));

  // Sort the data rows
  const sortedVolumeAttachments = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedVolumeAttachments.map(row => {
    const va = row._va;
    return {
      Name: <VolumeAttachmentResourceLink name={va.metadata.name} />,
      Attached: formatAttachmentStatus(va.status?.attached),
      'PV Name': formatPVName(va.spec.source),
      'Node Name': va.spec.nodeName,
      Attacher: va.spec.attacher,
      Age: va.metadata.creationTimestamp 
        ? calculateAge(new Date(va.metadata.creationTimestamp))
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

// Helper function to format attachment status
const formatAttachmentStatus = (attached: boolean | undefined): JSX.Element => {
  if (attached === undefined) return <span className="text-gray-600">Unknown</span>;
  return attached ? 
    <span className="text-green-500">Yes</span> : 
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