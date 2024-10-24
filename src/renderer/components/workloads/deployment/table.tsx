import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getReplicaStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { DeploymentResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  deployments: k8s.V1DeploymentList
}

export const DeploymentList = ({ deployments }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  
  const headers = ['Name', 'Namespace', 'Ready', 'Up-to-date', 'Available', 'Age'];

  const filteredDeployments = activeNamespace === "all" 
  ? deployments.items 
  : deployments.items.filter(deployment => deployment.metadata.namespace === activeNamespace);


  const processedRows = filteredDeployments.map(deployment => ({
    Name: <DeploymentResourceLink name={deployment.metadata.name} namespace={deployment.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={deployment.metadata.namespace} />,
    Ready: getReplicaStatus(deployment.status.readyReplicas || 0, deployment.status.replicas),
    'Up-to-date': deployment.status.updatedReplicas,
    Available: deployment.status.availableReplicas,
    Age: calculateAge(deployment.metadata.creationTimestamp),
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}