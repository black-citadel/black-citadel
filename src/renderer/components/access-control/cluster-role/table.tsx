import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { ClusterRoleResourceLink } from './resource-link';

interface Props {
  clusterRoles: k8s.V1ClusterRoleList;
}

export const ClusterRoleList = ({ clusterRoles }: Props): JSX.Element => {
  const headers = ['Name', 'Rules', 'Aggregation Rule', 'Age'];

  const processedRows = clusterRoles.items.map(clusterRole => ({
    Name: <ClusterRoleResourceLink name={clusterRole.metadata.name} />,
    Rules: formatRules(clusterRole.rules),
    'Aggregation Rule': formatAggregationRule(clusterRole.aggregationRule),
    Age: clusterRole.metadata.creationTimestamp 
      ? calculateAge(new Date(clusterRole.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format rules
const formatRules = (rules: k8s.V1PolicyRule[] | undefined): JSX.Element => {
  if (!rules || rules.length === 0) return <span>-</span>;
  
  const rulesSummary = rules.map(rule => {
    const resources = rule.resources?.join(', ') || '*';
    const verbs = rule.verbs.join(', ');
    return `${resources}: ${verbs}`;
  });

  return (
    <span title={rulesSummary.join('\n')} className="cursor-help">
      {rules.length} rule(s)
    </span>
  );
};

// Helper function to format aggregation rule
const formatAggregationRule = (aggregationRule: k8s.V1AggregationRule | undefined): JSX.Element => {
  if (!aggregationRule || !aggregationRule.clusterRoleSelectors || aggregationRule.clusterRoleSelectors.length === 0) {
    return <span>-</span>;
  }

  const selectorSummary = aggregationRule.clusterRoleSelectors.map(selector => 
    Object.entries(selector.matchLabels || {}).map(([key, value]) => `${key}: ${value}`).join(', ')
  );

  return (
    <span title={selectorSummary.join('\n')} className="cursor-help">
      {aggregationRule.clusterRoleSelectors.length} selector(s)
    </span>
  );
};
