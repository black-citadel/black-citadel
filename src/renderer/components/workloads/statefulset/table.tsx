import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getReplicaStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { StatefulSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  statefulSets: k8s.V1StatefulSetList
}

export const StatefulSetList = ({ statefulSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Ready', 'Age'];

  const filteredStatefulSets = activeNamespace === "all" 
  ? statefulSets.items 
  : statefulSets.items.filter(statefulSet => statefulSet.metadata.namespace === activeNamespace);

  const processedRows = filteredStatefulSets.map(statefulSet => ({
    Name: <StatefulSetResourceLink name={statefulSet.metadata.name} namespace={statefulSet.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={statefulSet.metadata.namespace} />,
    Ready: getReplicaStatus(statefulSet.status.readyReplicas || 0, statefulSet.status.replicas),
    Age: calculateAge(statefulSet.metadata.creationTimestamp)
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}