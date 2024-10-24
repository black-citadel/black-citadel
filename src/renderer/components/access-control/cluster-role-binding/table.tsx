import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { ClusterRoleResourceLink } from '@components/access-control/cluster-role/resource-link';
import { ClusterRoleBindingResourceLink } from './resource-link';

interface Props {
  clusterRoleBindings: k8s.V1ClusterRoleBindingList;
}

export const ClusterRoleBindingList = ({ clusterRoleBindings }: Props): JSX.Element => {
  const headers = ['Name', 'ClusterRole', 'Subjects', 'Age'];

  const processedRows = clusterRoleBindings.items.map(crb => ({
    Name: <ClusterRoleBindingResourceLink name={crb.metadata.name} />,
    ClusterRole: <ClusterRoleResourceLink name={crb.roleRef.name} />,
    Subjects: formatSubjects(crb.subjects),
    Age: crb.metadata.creationTimestamp
      ? calculateAge(new Date(crb.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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
