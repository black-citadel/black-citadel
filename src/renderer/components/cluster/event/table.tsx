import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { sortRows, type SortConfig } from '@utils/sorting';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';

interface Props {
  events: k8s.CoreV1EventList;
}

interface DataRow {
  Type: string;
  Age: number;
  Object: string;
  Namespace: string;
  'Event Details': string;
  _display: {
    Type: JSX.Element;
    Age: JSX.Element;
    Object: JSX.Element;
    Namespace: JSX.Element;
    'Event Details': JSX.Element;
  };
}

export const EventList = ({ events }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>({
    column: 'Age',
    direction: 'desc'
  });
  const headers = ['Type', 'Age', 'Object', 'Namespace', 'Event Details'];

  // Create data rows with raw values for sorting
  const dataRows: DataRow[] = events.items.map(event => ({
    Type: event.type || 'Unknown',
    Age: event.lastTimestamp ? new Date(event.lastTimestamp).getTime() : 0,
    Object: event.involvedObject ? `${event.involvedObject.kind}/${event.involvedObject.name}` : 'N/A',
    Namespace: event.metadata?.namespace || '',
    'Event Details': `${event.reason || 'N/A'} ${event.message || ''}`,
    _display: {
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
    }
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => ({
    Type: row._display.Type,
    Age: row._display.Age,
    Object: row._display.Object,
    Namespace: row._display.Namespace,
    'Event Details': row._display['Event Details']
  }));

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};