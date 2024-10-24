import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { PriorityClassResourceLink } from './resource-link';

interface Props {
  priorityClasses: k8s.V1PriorityClassList;
}

export const PriorityClassList = ({ priorityClasses }: Props): JSX.Element => {
  const headers = ['Name', 'Value', 'Global Default', 'Non-Preempting', 'Description', 'Age'];

  const processedRows = priorityClasses.items.map(pc => ({
    Name: <PriorityClassResourceLink name={pc.metadata.name} />,
    Value: pc.value,
    'Global Default': formatGlobalDefault(pc.globalDefault),
    'Non-Preempting': formatNonPreempting(pc.preemptionPolicy),
    Description: formatDescription(pc.description),
    Age: pc.metadata.creationTimestamp 
      ? calculateAge(new Date(pc.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format global default status
const formatGlobalDefault = (isGlobalDefault: boolean | undefined): JSX.Element => {
  if (isGlobalDefault === undefined) return <span>-</span>;
  return isGlobalDefault ? 
    <span className="text-green-600">Yes</span> : 
    <span className="text-red-600">No</span>;
};

// Helper function to format non-preempting status
const formatNonPreempting = (preemptionPolicy: string | undefined): JSX.Element => {
  if (preemptionPolicy === undefined) return <span>-</span>;
  return preemptionPolicy === 'Never' ? 
    <span className="text-green-600">Yes</span> : 
    <span className="text-red-600">No</span>;
};

// Helper function to format description
const formatDescription = (description: string | undefined): JSX.Element => {
  if (!description) return <span>-</span>;
  return (
    <span title={description} className="cursor-help">
      {description.length > 50 ? `${description.substring(0, 47)}...` : description}
    </span>
  );
};