import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { ClusterRoleResourceLink } from './resource-link';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  clusterRoles: k8s.V1ClusterRoleList;
}

export const ClusterRoleList = ({ clusterRoles }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const headers = ['Name', 'Rules', 'Aggregation Rule', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = clusterRoles.items.map(clusterRole => ({
    Name: clusterRole.metadata.name,
    Rules: clusterRole.rules?.length || 0,
    'Aggregation Rule': clusterRole.aggregationRule?.clusterRoleSelectors?.length || 0,
    Age: clusterRole.metadata.creationTimestamp 
      ? calculateAge(new Date(clusterRole.metadata.creationTimestamp))
      : 'N/A',
    _clusterRole: clusterRole // Keep reference to original cluster role
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedRows.map(row => {
    const clusterRole = row._clusterRole;
    return {
      Name: <ClusterRoleResourceLink name={clusterRole.metadata.name} />,
      Rules: formatRules(clusterRole.rules),
      'Aggregation Rule': formatAggregationRule(clusterRole.aggregationRule),
      Age: clusterRole.metadata.creationTimestamp 
        ? calculateAge(new Date(clusterRole.metadata.creationTimestamp))
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
