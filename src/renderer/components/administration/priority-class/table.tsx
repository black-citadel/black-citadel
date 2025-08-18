import { useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { PriorityClassResourceLink } from './resource-link';

interface Props {
  priorityClasses: k8s.V1PriorityClassList;
}

export const PriorityClassList = ({ priorityClasses }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Value', 'Global Default', 'Non-Preempting', 'Description', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows = priorityClasses.items.map(pc => ({
    Name: pc.metadata.name || '',
    Value: pc.value,
    'Global Default': pc.globalDefault === true,
    'Non-Preempting': pc.preemptionPolicy === 'Never',
    Description: pc.description || '',
    Age: pc.metadata.creationTimestamp || '',
    _raw: pc
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to React components
  const processedRows = sortedRows.map(row => ({
    Name: <PriorityClassResourceLink name={row._raw.metadata.name} />,
    Value: row._raw.value,
    'Global Default': formatGlobalDefault(row._raw.globalDefault),
    'Non-Preempting': formatNonPreempting(row._raw.preemptionPolicy),
    Description: formatDescription(row._raw.description),
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