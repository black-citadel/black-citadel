import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { ClusterRoleResourceLink } from '@components/access-control/cluster-role/resource-link';
import { ClusterRoleBindingResourceLink } from './resource-link';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  clusterRoleBindings: k8s.V1ClusterRoleBindingList;
}

export const ClusterRoleBindingList = ({ clusterRoleBindings }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const headers = ['Name', 'ClusterRole', 'Subjects', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = clusterRoleBindings.items.map(crb => ({
    Name: crb.metadata.name,
    ClusterRole: crb.roleRef.name,
    Subjects: crb.subjects?.length || 0,
    Age: crb.metadata.creationTimestamp
      ? calculateAge(new Date(crb.metadata.creationTimestamp))
      : 'N/A',
    _clusterRoleBinding: crb // Keep reference to original cluster role binding
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedRows.map(row => {
    const crb = row._clusterRoleBinding;
    return {
      Name: <ClusterRoleBindingResourceLink name={crb.metadata.name} />,
      ClusterRole: <ClusterRoleResourceLink name={crb.roleRef.name} />,
      Subjects: formatSubjects(crb.subjects),
      Age: crb.metadata.creationTimestamp
        ? calculateAge(new Date(crb.metadata.creationTimestamp))
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

  const subjectSummary = subjects.map(subject => {
    let summary = `${subject.kind}: ${subject.name}`;
    if (subject.namespace) {
      summary += ` (namespace: ${subject.namespace})`;
    }
    return summary;
  });

  return (
    <span title={subjectSummary.join('\n')} className="cursor-help">
      {subjects.length} subject(s)
    </span>
  );
};
