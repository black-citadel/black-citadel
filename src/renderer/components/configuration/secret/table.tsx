import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { SecretResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  secrets: k8s.V1SecretList;
}

export const SecretList = ({ secrets }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Type', 'Data', 'Age'];

  const filteredSecrets = activeNamespace === "all" 
  ? secrets.items 
  : secrets.items.filter(secret => secret.metadata.namespace === activeNamespace);

  const processedRows = filteredSecrets.map(secret => ({
    Name: <SecretResourceLink name={secret.metadata.name} namespace={secret.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={secret.metadata.namespace} />,
    Type: secret.type || 'Opaque',
    Data: formatSecretData(secret.data),
    Age: secret.metadata.creationTimestamp 
      ? calculateAge(new Date(secret.metadata.creationTimestamp))
      : '-'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format Secret data
const formatSecretData = (data: { [key: string]: string } | undefined): string => {
  if (!data) return '';
  const count = Object.keys(data).length;
  return `${count} item${count !== 1 ? 's' : ''}`;
};
