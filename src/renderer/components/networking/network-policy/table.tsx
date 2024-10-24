import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { NetworkPolicyResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  networkPolicies: k8s.V1NetworkPolicyList;
}

export const NetworkPolicyList = ({ networkPolicies }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Pod Selector', 'Policy Types', 'Age'];

  const filteredNetworkPolicies = activeNamespace === "all" 
  ? networkPolicies.items 
  : networkPolicies.items.filter(networkPolicy => networkPolicy.metadata.namespace === activeNamespace);

  const processedRows = filteredNetworkPolicies.map(networkPolicy => ({
    Name: <NetworkPolicyResourceLink name={networkPolicy.metadata.name} namespace={networkPolicy.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={networkPolicy.metadata.namespace} />,
    'Pod Selector': formatLabelSelector(networkPolicy.spec.podSelector),
    'Policy Types': formatPolicyTypes(networkPolicy.spec.policyTypes),
    Age: networkPolicy.metadata.creationTimestamp 
      ? calculateAge(new Date(networkPolicy.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format label selector
const formatLabelSelector = (selector: k8s.V1LabelSelector): string => {
  if (!selector) return 'None';

  const matchLabels = selector.matchLabels 
    ? Object.entries(selector.matchLabels).map(([k, v]) => `${k}=${v}`).join(', ')
    : '';

  const matchExpressions = selector.matchExpressions
    ? selector.matchExpressions.map(expr => 
        `${expr.key} ${expr.operator.toLowerCase()} (${expr.values?.join(', ') || ''})`
      ).join('; ')
    : '';

  return [matchLabels, matchExpressions].filter(Boolean).join('; ') || 'All Pods';
};

// Helper function to format policy types
const formatPolicyTypes = (policyTypes: string[] | undefined): string => {
  return policyTypes?.join(', ') || 'None';
};