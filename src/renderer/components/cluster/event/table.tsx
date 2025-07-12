import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';

interface Props {
  events: k8s.CoreV1EventList;
}

export const EventList = ({ events }: Props): JSX.Element => {
  const headers = ['Type', 'Age', 'Object', 'Namespace', 'Event Details'];

  const processedRows = events.items
    .sort((a, b) => {
      // Sort by lastTimestamp (most recent first)
      const aTime = a.lastTimestamp ? new Date(a.lastTimestamp).getTime() : 0;
      const bTime = b.lastTimestamp ? new Date(b.lastTimestamp).getTime() : 0;
      return bTime - aTime;
    })
    .map(event => ({
      Type: (
        <span className={`font-medium ${event.type === 'Warning' ? 'text-red-600' : 'text-green-500'}`}>
          {event.type || 'Unknown'}
        </span>
      ),
      Age: (
        <span className="text-sm whitespace-nowrap">
          {event.lastTimestamp ? calculateAge(new Date(event.lastTimestamp)) : 'N/A'}
        </span>
      ),
      Object: (
        <div className="text-sm">
          <div className="font-medium">
            {event.involvedObject ? `${event.involvedObject.kind}/${event.involvedObject.name}` : 'N/A'}
          </div>
        </div>
      ),
      Namespace: <NamespaceResourceLink name={event.metadata?.namespace} />,
      'Event Details': (
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-zinc-400">Reason:</span>
            <span className="text-sm font-medium">{event.reason || 'N/A'}</span>
          </div>
          <div className="text-sm text-zinc-300 break-words">
            {event.message || 'No message'}
          </div>
          {event.count && event.count > 1 && (
            <div className="text-xs text-zinc-500">
              Occurred {event.count} times
            </div>
          )}
        </div>
      )
    }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};