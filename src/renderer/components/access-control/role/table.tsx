import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { RoleResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  roles: k8s.V1RoleList;
}

export const RoleList = ({ roles }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Rules', 'Age'];

  const filteredRoles = activeNamespace === "all" 
  ? roles.items 
  : roles.items.filter(role => role.metadata.namespace === activeNamespace);

  const processedRows = filteredRoles.map(role => ({
    Name: <RoleResourceLink name={role.metadata.name} namespace={role.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={role.metadata.namespace} />,
    Rules: formatRules(role.rules),
    Age: role.metadata.creationTimestamp 
      ? calculateAge(new Date(role.metadata.creationTimestamp))
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

// Helper function to calculate age
const calculateAge = (creationDate: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - creationDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};