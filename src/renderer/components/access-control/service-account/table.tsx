import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ServiceAccountResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  serviceAccounts: k8s.V1ServiceAccountList;
}

export const ServiceAccountList = ({ serviceAccounts }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Secrets', 'Image Pull Secrets', 'Automount Token', 'Age'];

  const filteredServiceAccounts = activeNamespace === "all" 
  ? serviceAccounts.items 
  : serviceAccounts.items.filter(serviceAccount => serviceAccount.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredServiceAccounts.map(sa => ({
    Name: sa.metadata.name,
    Namespace: sa.metadata.namespace,
    Secrets: sa.secrets?.length || 0,
    'Image Pull Secrets': sa.imagePullSecrets?.length || 0,
    'Automount Token': sa.automountServiceAccountToken === undefined ? 'Default' : 
                       sa.automountServiceAccountToken ? 'Yes' : 'No',
    Age: sa.metadata.creationTimestamp 
      ? calculateAge(new Date(sa.metadata.creationTimestamp))
      : 'N/A',
    _serviceAccount: sa // Keep reference to original service account
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedRows.map(row => {
    const sa = row._serviceAccount;
    return {
      Name: <ServiceAccountResourceLink name={sa.metadata.name} namespace={sa.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={sa.metadata.namespace} />,
      Secrets: formatSecrets(sa.secrets),
      'Image Pull Secrets': formatImagePullSecrets(sa.imagePullSecrets),
      'Automount Token': formatAutomountToken(sa.automountServiceAccountToken),
      Age: sa.metadata.creationTimestamp 
        ? calculateAge(new Date(sa.metadata.creationTimestamp))
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

// Helper function to format secrets
const formatSecrets = (secrets: k8s.V1ObjectReference[] | undefined): JSX.Element => {
  if (!secrets || secrets.length === 0) return <span>-</span>;
  
  return (
    <span title={secrets.map(s => s.name).join(', ')}>
      {secrets.length} secret(s)
    </span>
  );
};

// Helper function to format image pull secrets
const formatImagePullSecrets = (imagePullSecrets: k8s.V1LocalObjectReference[] | undefined): JSX.Element => {
  if (!imagePullSecrets || imagePullSecrets.length === 0) return <span>-</span>;
  
  return (
    <span title={imagePullSecrets.map(s => s.name).join(', ')}>
      {imagePullSecrets.length} secret(s)
    </span>
  );
};

// Helper function to format automount token status
const formatAutomountToken = (automount: boolean | undefined): JSX.Element => {
  if (automount === undefined) return <span className="text-gray-600">Default</span>;
  return automount ? 
    <span className="text-green-500">Yes</span> : 
    <span className="text-red-600">No</span>;
};