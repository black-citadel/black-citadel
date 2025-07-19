import k8s = require('@kubernetes/client-node');
import { ListTable, Badge } from '@protoku/design-system';
import { ServiceAccountResourceLink } from './service-account/resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  subjects?: k8s.RbacV1Subject[];
}

export const SubjectList = ({ subjects }: Props): JSX.Element => {
  const { viewContext } = useView()

  const headers = ['Name', 'Namespace', 'Kind', 'API Group'];

  const rows = subjects.map((subject) => ({
    'Name': subject.kind === 'ServiceAccount'
      ? <ServiceAccountResourceLink name={subject.name} namespace={subject.namespace ? subject.namespace : viewContext.namespace} />
      : <><Badge variant="gray" className='mr-2'>{subject.kind.toLowerCase()}</Badge> {subject.name}</>,
    'Namespace': subject.namespace,
    'Kind': subject.kind,
    'API Group': subject.apiGroup,
  }));

  return (
    <ListTable headers={headers} rows={rows} />
  );
};
