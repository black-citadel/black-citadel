import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { EventResourceLink } from './resource-link';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';

interface Props {
  events: k8s.CoreV1EventList;
}

export const EventList = ({ events }: Props): JSX.Element => {
  const headers = ['Name', 'Namespace', 'Type', 'Reason', 'Object', 'Message', 'Age'];

  const processedRows = events.items
    .sort((a, b) => {
      // Sort by lastTimestamp (most recent first)
      const aTime = a.lastTimestamp ? new Date(a.lastTimestamp).getTime() : 0;
      const bTime = b.lastTimestamp ? new Date(b.lastTimestamp).getTime() : 0;
      return bTime - aTime;
    })
    .map(event => ({
      Name: <EventResourceLink name={event.metadata?.name} namespace={event.metadata?.namespace} />,
      Namespace: <NamespaceResourceLink name={event.metadata?.namespace} />,
      Type: (
        <span className={event.type === 'Warning' ? 'text-red-600' : 'text-green-600'}>
          {event.type || 'Unknown'}
        </span>
      ),
      Reason: event.reason || 'N/A',
      Object: event.involvedObject ? `${event.involvedObject.kind}/${event.involvedObject.name}` : 'N/A',
      Message: (
        <span className='truncate max-w-md' title={event.message}>
          {event.message || 'No message'}
        </span>
      ),
      Age: event.lastTimestamp
        ? calculateAge(new Date(event.lastTimestamp))
        : 'N/A'
    }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};