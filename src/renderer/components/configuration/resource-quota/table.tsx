import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ResourceQuotaResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  resourceQuotas: k8s.V1ResourceQuotaList;
}

export const ResourceQuotaList = ({ resourceQuotas }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const headers = ['Name', 'Namespace', 'Resources', 'Age'];

  const filteredResourceQuotas = activeNamespace === "all"
    ? resourceQuotas.items
    : resourceQuotas.items.filter(resourceQuota => resourceQuota.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredResourceQuotas.map(quota => ({
    Name: quota.metadata.name,
    Namespace: quota.metadata.namespace,
    Resources: Object.keys(quota.spec.hard).length,
    Age: quota.metadata.creationTimestamp
      ? new Date(quota.metadata.creationTimestamp).getTime()
      : 0,
    _quota: quota // Keep reference to original quota
  }));

  // Sort the data rows
  const sortedQuotas = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedQuotas.map(row => {
    const quota = row._quota;
    return {
      Name: <ResourceQuotaResourceLink name={quota.metadata.name} namespace={quota.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={quota.metadata.namespace} />,
      Resources: (
        <ul>
          {Object.entries(quota.spec.hard).map(([resource, _]) => (
            <li key={resource}>{resource}</li>
          ))}
        </ul>
      ),
      Age: quota.metadata.creationTimestamp
        ? calculateAge(new Date(quota.metadata.creationTimestamp))
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
