import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { RoleBindingResourceLink } from './resource-link';
import { RoleResourceLink } from '../role/resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  roleBindings: k8s.V1RoleBindingList;
}

export const RoleBindingList = ({ roleBindings }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Role', 'Subjects', 'Age'];

  const filteredRoleBindings = activeNamespace === "all" 
  ? roleBindings.items 
  : roleBindings.items.filter(roleBinding => roleBinding.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredRoleBindings.map(roleBinding => ({
    Name: roleBinding.metadata.name,
    Namespace: roleBinding.metadata.namespace,
    Role: roleBinding.roleRef.name,
    Subjects: roleBinding.subjects?.length || 0,
    Age: roleBinding.metadata.creationTimestamp 
      ? calculateAge(new Date(roleBinding.metadata.creationTimestamp))
      : 'N/A',
    _roleBinding: roleBinding // Keep reference to original role binding
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedRows.map(row => {
    const roleBinding = row._roleBinding;
    return {
      Name: <RoleBindingResourceLink name={roleBinding.metadata.name} namespace={roleBinding.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={roleBinding.metadata.namespace} />,
      Role: <RoleResourceLink name={roleBinding.roleRef.name} namespace={roleBinding.metadata.namespace} />,
      Subjects: formatSubjects(roleBinding.subjects),
      Age: roleBinding.metadata.creationTimestamp 
        ? calculateAge(new Date(roleBinding.metadata.creationTimestamp))
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
