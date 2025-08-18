import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { NodeResourceLink } from './resource-link';
import { Status } from '@protoku-bv/design-system';

interface Props {
  nodes: k8s.V1NodeList;
}

interface DataRow {
  Name: string;
  Status: string;
  Roles: string;
  Version: string;
  Age: number;
  _display: {
    Name: JSX.Element;
    Status: JSX.Element;
    Roles: string;
    Version: string;
    Age: string;
  };
}

export const NodeList = ({ nodes }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Status', 'Roles', 'Version', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows: DataRow[] = nodes.items.map(node => {
    const readyCondition = node.status?.conditions?.find(c => c.type === 'Ready');
    const statusText = readyCondition?.status === 'True' ? 'Ready' : 
                      readyCondition?.status === 'False' ? 'NotReady' : 'Unknown';
    
    return {
      Name: node.metadata.name || '',
      Status: statusText,
      Roles: node.metadata.labels?.['kubernetes.io/role'] || 'none',
      Version: node.status?.nodeInfo?.kubeletVersion || '',
      Age: node.metadata?.creationTimestamp ? new Date(node.metadata.creationTimestamp).getTime() : 0,
      _display: {
        Name: <NodeResourceLink name={node.metadata.name} />,
        Status: formatNodeStatus(node.status),
        Roles: node.metadata.labels?.['kubernetes.io/role'] || 'none',
        Version: node.status?.nodeInfo?.kubeletVersion || '',
        Age: node.metadata?.creationTimestamp
          ? calculateAge(new Date(node.metadata.creationTimestamp))
          : 'N/A'
      }
    };
  });

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => ({
    Name: row._display.Name,
    Status: row._display.Status,
    Roles: row._display.Roles,
    Version: row._display.Version,
    Age: row._display.Age
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

function formatNodeStatus(status: k8s.V1NodeStatus): JSX.Element {
  if (!status.conditions) {
    return <Status variant="default">Unknown</Status>;
  }

  const readyCondition = status.conditions.find(
    condition => condition.type === 'Ready'
  );

  if (!readyCondition) {
    return <Status variant="default">Unknown</Status>;
  }

  if (readyCondition.status === 'True') {
    return <Status variant="success">Ready</Status>;
  } else if (readyCondition.status === 'False') {
    return <Status variant="error">NotReady{readyCondition.reason ? ` (${readyCondition.reason})` : ''}</Status>;
  } else {
    return <Status variant="warning">Unknown{readyCondition.reason ? ` (${readyCondition.reason})` : ''}</Status>;
  }
}