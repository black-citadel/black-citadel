import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getReplicaStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ReplicaSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  replicaSets: k8s.V1ReplicaSetList
}

export const ReplicaSetList = ({ replicaSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Desired', 'Current', 'Ready', 'Age'];

  const filteredResplicaSets = activeNamespace === "all" 
  ? replicaSets.items 
  : replicaSets.items.filter(replicaSet => replicaSet.metadata.namespace === activeNamespace);

  const processedRows = filteredResplicaSets.map(replicaSet => ({
    Name: <ReplicaSetResourceLink name={replicaSet.metadata.name} namespace={replicaSet.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={replicaSet.metadata.namespace} />,
    Desired: replicaSet.spec.replicas,
    Current: replicaSet.status.replicas,
    Ready: getReplicaStatus(replicaSet.status.readyReplicas || 0, replicaSet.status.replicas),
    Age: calculateAge(replicaSet.metadata.creationTimestamp),
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}