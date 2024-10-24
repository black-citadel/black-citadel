import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { RoleBindingResourceLink } from './resource-link';
import { RoleResourceLink } from '../role/resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  roleBindings: k8s.V1RoleBindingList;
}

export const RoleBindingList = ({ roleBindings }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Role', 'Subjects', 'Age'];

  const filteredRoleBindings = activeNamespace === "all" 
  ? roleBindings.items 
  : roleBindings.items.filter(roleBinding => roleBinding.metadata.namespace === activeNamespace);

  const processedRows = filteredRoleBindings.map(roleBinding => ({
    Name: <RoleBindingResourceLink name={roleBinding.metadata.name} namespace={roleBinding.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={roleBinding.metadata.namespace} />,
    Role: <RoleResourceLink name={roleBinding.roleRef.name} namespace={roleBinding.metadata.namespace} />,
    Subjects: formatSubjects(roleBinding.subjects),
    Age: roleBinding.metadata.creationTimestamp 
      ? calculateAge(new Date(roleBinding.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format subjects
const formatSubjects = (subjects: k8s.RbacV1Subject[] | undefined): JSX.Element => {
  if (!subjects || subjects.length === 0) return <span>-</span>;
  
  const subjectSummary = subjects.map(subject => `${subject.kind}: ${subject.name}`);
  
  return (
    <span title={subjectSummary.join('\n')} className="cursor-help">
      {subjects.length} subject(s)
    </span>
  );
};
