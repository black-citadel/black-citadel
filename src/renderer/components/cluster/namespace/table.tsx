import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { NamespaceResourceLink } from './resource-link';
import { Status } from '@protoku/design-system';

interface Props {
  namespaces: k8s.V1NamespaceList;
}

export const NamespaceList = ({ namespaces }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Phase', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows = namespaces.items.map(ns => ({
    Name: ns.metadata.name || '',
    Phase: ns.status?.phase || '',
    Age: ns.metadata?.creationTimestamp ? new Date(ns.metadata.creationTimestamp).getTime() : 0,
    _ns: ns
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => {
    const ns = row._ns;
    return {
      Name: <NamespaceResourceLink name={ns.metadata.name} />,
      Phase: ns.status?.phase ? (
        <Status variant={ns.status.phase === 'Active' ? 'success' : 'default'}>
          {ns.status.phase}
        </Status>
      ) : (
        <span>-</span>
      ),
      Age: ns.metadata?.creationTimestamp
        ? calculateAge(new Date(ns.metadata.creationTimestamp))
        : 'N/A'
    };
  });

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};