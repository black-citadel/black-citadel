import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { LimitRangeResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  limitRanges: k8s.V1LimitRangeList;
}

export const LimitRangeList = ({ limitRanges }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const headers = ['Name', 'Namespace', 'Limits'];

  const filteredLimitRanges = activeNamespace === "all"
    ? limitRanges.items
    : limitRanges.items.filter(limitRange => limitRange.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredLimitRanges.map(limitRange => ({
    Name: limitRange.metadata.name,
    Namespace: limitRange.metadata.namespace,
    Limits: limitRange.spec.limits.length,
    _limitRange: limitRange // Keep reference to original limitRange
  }));

  // Sort the data rows
  const sortedLimitRanges = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedLimitRanges.map(row => {
    const limitRange = row._limitRange;
    return {
      Name: <LimitRangeResourceLink name={limitRange.metadata.name} namespace={limitRange.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={limitRange.metadata.namespace} />,
      Limits: limitRange.spec.limits.length,
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