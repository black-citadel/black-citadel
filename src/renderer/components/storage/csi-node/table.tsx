import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { CSINodeResourceLink } from './resource-link';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface CSINodeListProps {
  csiNodes: k8s.V1CSINodeList;
}

export const CSINodeList = ({ csiNodes }: CSINodeListProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Drivers', 'Allocatable', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = csiNodes.items.map(csiNode => ({
    Name: csiNode.metadata.name,
    Drivers: csiNode.spec?.drivers?.length || 0,
    Allocatable: csiNode.spec?.drivers?.filter(d => d.allocatable?.count !== undefined).length || 0,
    Age: csiNode.metadata.creationTimestamp 
      ? new Date(csiNode.metadata.creationTimestamp).getTime()
      : 0,
    _csiNode: csiNode // Keep reference to original csiNode
  }));

  // Sort the data rows
  const sortedCSINodes = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedCSINodes.map(row => {
    const csiNode = row._csiNode;
    return {
      Name: <CSINodeResourceLink name={csiNode.metadata.name} />,
      Drivers: formatDrivers(csiNode.spec?.drivers),
      Allocatable: formatAllocatable(csiNode.spec?.drivers),
      Age: csiNode.metadata.creationTimestamp 
        ? calculateAge(new Date(csiNode.metadata.creationTimestamp))
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

// Helper function to format drivers
const formatDrivers = (drivers: k8s.V1CSINodeDriver[] | undefined): JSX.Element => {
  if (!drivers || drivers.length === 0) return <span>-</span>;
  
  const driverNames = drivers.map(d => d.name);
  return (
    <span title={driverNames.join(', ')}>
      {driverNames.length} driver(s)
    </span>
  );
};

// Helper function to format allocatable resources
const formatAllocatable = (drivers: k8s.V1CSINodeDriver[] | undefined): JSX.Element => {
  if (!drivers || drivers.length === 0) return <span>-</span>;
  
  const allocatable = drivers.filter(d => d.allocatable?.count !== undefined);
  if (allocatable.length === 0) return <span>-</span>;

  const allocatableInfo = allocatable.map(d => `${d.name}: ${d.allocatable?.count}`);
  return (
    <span title={allocatableInfo.join(', ')}>
      {allocatable.length} allocatable
    </span>
  );
};