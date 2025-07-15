import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NodeResourceLink } from './resource-link';
import { Status } from '@protoku/design-system';

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