import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { CSINodeResourceLink } from './resource-link';

interface CSINodeListProps {
  csiNodes: k8s.V1CSINodeList;
}

export const CSINodeList = ({ csiNodes }: CSINodeListProps): JSX.Element => {
  const headers = ['Name', 'Drivers', 'Allocatable', 'Age'];

  const processedRows = csiNodes.items.map(csiNode => ({
    Name: <CSINodeResourceLink name={csiNode.metadata.name} />,
    Drivers: formatDrivers(csiNode.spec?.drivers),
    Allocatable: formatAllocatable(csiNode.spec?.drivers),
    Age: csiNode.metadata.creationTimestamp 
      ? calculateAge(new Date(csiNode.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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