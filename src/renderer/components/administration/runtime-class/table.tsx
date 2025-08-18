import { useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { RuntimeClassResourceLink } from './resource-link';

interface RuntimeClassListProps {
  runtimeClasses: k8s.V1RuntimeClassList;
}

export const RuntimeClassList = ({ runtimeClasses }: RuntimeClassListProps): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Handler', 'Scheduling', 'Overhead', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows = runtimeClasses.items.map(rc => ({
    Name: rc.metadata.name || '',
    Handler: rc.handler,
    Scheduling: rc.scheduling ? 'Configured' : 'Not Configured',
    Overhead: rc.overhead?.podFixed ? 'Configured' : '-',
    Age: rc.metadata.creationTimestamp || '',
    _raw: rc
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to React components
  const processedRows = sortedRows.map(row => ({
    Name: <RuntimeClassResourceLink name={row._raw.metadata.name} />,
    Handler: row._raw.handler,
    Scheduling: formatScheduling(row._raw.scheduling),
    Overhead: formatOverhead(row._raw.overhead),
    Age: row._raw.metadata.creationTimestamp 
      ? calculateAge(new Date(row._raw.metadata.creationTimestamp))
      : 'N/A'
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