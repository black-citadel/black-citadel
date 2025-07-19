import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { SecretResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  secrets: k8s.V1SecretList;
}

export const SecretList = ({ secrets }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Type', 'Data', 'Age'];

  const filteredSecrets = activeNamespace === "all" 
  ? secrets.items 
  : secrets.items.filter(secret => secret.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredSecrets.map(secret => ({
    Name: secret.metadata.name,
    Namespace: secret.metadata.namespace,
    Type: secret.type || 'Opaque',
    Data: secret.data ? Object.keys(secret.data).length : 0,
    Age: secret.metadata.creationTimestamp 
      ? new Date(secret.metadata.creationTimestamp).getTime()
      : 0,
    _secret: secret // Keep reference to original secret
  }));

  // Sort the data rows
  const sortedSecrets = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedSecrets.map(row => {
    const secret = row._secret;
    return {
      Name: <SecretResourceLink name={secret.metadata.name} namespace={secret.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={secret.metadata.namespace} />,
      Type: secret.type || 'Opaque',
      Data: formatSecretData(secret.data),
      Age: secret.metadata.creationTimestamp 
        ? calculateAge(new Date(secret.metadata.creationTimestamp))
        : '-'
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

// Helper function to format Secret data
const formatSecretData = (data: { [key: string]: string } | undefined): string => {
  if (!data) return '';
  const count = Object.keys(data).length;
  return `${count} item${count !== 1 ? 's' : ''}`;
};
