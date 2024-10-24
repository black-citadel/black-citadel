import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ResourceQuotaResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  resourceQuotas: k8s.V1ResourceQuotaList;
}

export const ResourceQuotaList = ({ resourceQuotas }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const headers = ['Name', 'Namespace', 'Resources', 'Age'];

  const filteredResourceQuotas = activeNamespace === "all"
    ? resourceQuotas.items
    : resourceQuotas.items.filter(resourceQuota => resourceQuota.metadata.namespace === activeNamespace);

  const processedRows = filteredResourceQuotas.map(quota => ({
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
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format ResourceQuota data
const formatResourceQuota = (quota: k8s.V1ResourceQuota): Array<{ name: string; used: string; hard: string }> => {
  const result: Array<{ name: string; used: string; hard: string }> = [];

  if (quota.spec?.hard && quota.status?.hard && quota.status?.used) {
    for (const [key, hardValue] of Object.entries(quota.spec.hard)) {
      result.push({
        name: key,
        used: quota.status.used[key] || '0',
        hard: hardValue
      });
    }
  }

  return result;
};
