import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NodeResourceLink } from './resource-link';

interface Props {
  nodes: k8s.V1NodeList;
}

export const NodeList = ({ nodes }: Props): JSX.Element => {
  const headers = ['Name', 'Status', 'Roles', 'Version', 'Age'];

  const processedRows = nodes.items.map(node => ({
    Name: <NodeResourceLink name={node.metadata.name} />,
    Status: formatNodeStatus(node.status),
    Roles: node.metadata.labels['kubernetes.io/role'] || 'none',
    Version: node.status.nodeInfo.kubeletVersion,
    Age: node.metadata?.creationTimestamp
      ? calculateAge(new Date(node.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

function formatNodeStatus(status: k8s.V1NodeStatus): string {
  if (!status.conditions) {
    return 'Unknown';
  }

  const readyCondition = status.conditions.find(
    condition => condition.type === 'Ready'
  );

  if (!readyCondition) {
    return 'Unknown';
  }

  if (readyCondition.status === 'True') {
    return 'Ready';
  } else if (readyCondition.status === 'False') {
    return `NotReady (${readyCondition.reason})`;
  } else {
    return `Unknown (${readyCondition.reason})`;
  }
}