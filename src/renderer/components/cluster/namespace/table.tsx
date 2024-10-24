import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from './resource-link';
import { formatStatus } from './helpers';

interface Props {
  namespaces: k8s.V1NamespaceList;
}

export const NamespaceList = ({ namespaces }: Props): JSX.Element => {
  const headers = ['Name', 'Phase', 'Age'];

  const processedRows = namespaces.items.map(ns => ({
    Name: <NamespaceResourceLink name={ns.metadata.name} />,
    Phase: formatStatus(ns.status?.phase),
    Age: ns.metadata?.creationTimestamp
      ? calculateAge(new Date(ns.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};