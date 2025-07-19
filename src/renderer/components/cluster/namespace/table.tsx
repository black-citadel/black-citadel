import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { sortRows, type SortConfig } from '@utils/sorting';
import { NamespaceResourceLink } from './resource-link';
import { formatStatus } from './helpers';

interface Props {
  namespaces: k8s.V1NamespaceList;
}

interface DataRow {
  Name: string;
  Phase: string;
  Age: number;
  _display: {
    Name: JSX.Element;
    Phase: JSX.Element;
    Age: string;
  };
}

export const NamespaceList = ({ namespaces }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Phase', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows: DataRow[] = namespaces.items.map(ns => ({
    Name: ns.metadata.name || '',
    Phase: ns.status?.phase || '',
    Age: ns.metadata?.creationTimestamp ? new Date(ns.metadata.creationTimestamp).getTime() : 0,
    _display: {
      Name: <NamespaceResourceLink name={ns.metadata.name} />,
      Phase: formatStatus(ns.status?.phase),
      Age: ns.metadata?.creationTimestamp
        ? calculateAge(new Date(ns.metadata.creationTimestamp))
        : 'N/A'
    }
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => ({
    Name: row._display.Name,
    Phase: row._display.Phase,
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