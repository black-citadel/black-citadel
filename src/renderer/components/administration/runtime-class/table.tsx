import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { RuntimeClassResourceLink } from './resource-link';

interface RuntimeClassListProps {
  runtimeClasses: k8s.V1RuntimeClassList;
}

export const RuntimeClassList = ({ runtimeClasses }: RuntimeClassListProps): JSX.Element => {
  const headers = ['Name', 'Handler', 'Scheduling', 'Overhead', 'Age'];

  const processedRows = runtimeClasses.items.map(rc => ({
    Name: <RuntimeClassResourceLink name={rc.metadata.name} />,
    Handler: rc.handler,
    Scheduling: formatScheduling(rc.scheduling),
    Overhead: formatOverhead(rc.overhead),
    Age: rc.metadata.creationTimestamp 
      ? calculateAge(new Date(rc.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format scheduling details
const formatScheduling = (scheduling: k8s.V1Scheduling | undefined): JSX.Element => {
  if (!scheduling) return <span>-</span>;
  
  const details = [];
  if (scheduling.nodeSelector) {
    details.push(`Node Selector: ${JSON.stringify(scheduling.nodeSelector)}`);
  }
  if (scheduling.tolerations) {
    details.push(`Tolerations: ${scheduling.tolerations.length}`);
  }
  
  const summary = details.length > 0 ? 'Configured' : 'Not Configured';
  
  return (
    <span title={details.join('\n')} className="cursor-help">
      {summary}
    </span>
  );
};

// Helper function to format overhead
const formatOverhead = (overhead: k8s.V1Overhead | undefined): JSX.Element => {
  if (!overhead || !overhead.podFixed) return <span>-</span>;
  
  const details = Object.entries(overhead.podFixed)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  return (
    <span title={details} className="cursor-help">
      Configured
    </span>
  );
};