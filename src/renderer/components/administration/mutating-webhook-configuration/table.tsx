import { useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { MutatingWebhookConfigurationResourceLink } from './resource-link';

interface Props {
  mutatingWebhookConfigurations: k8s.V1MutatingWebhookConfigurationList;
}

export const MutatingWebhookConfigurationList = ({ mutatingWebhookConfigurations }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Webhooks', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows = mutatingWebhookConfigurations.items.map(mwc => ({
    Name: mwc.metadata.name || '',
    Webhooks: mwc.webhooks?.length || 0,
    Age: mwc.metadata.creationTimestamp || '',
    _raw: mwc
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to React components
  const processedRows = sortedRows.map(row => ({
    Name: <MutatingWebhookConfigurationResourceLink name={row._raw.metadata.name} />,
    Webhooks: formatWebhooks(row._raw.webhooks),
    Age: row._raw.metadata.creationTimestamp 
      ? calculateAge(new Date(row._raw.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};

// Helper function to format webhooks
const formatWebhooks = (webhooks: k8s.V1MutatingWebhook[] | undefined): JSX.Element => {
  if (!webhooks || webhooks.length === 0) return <span>-</span>;
  
  const webhookDetails = webhooks.map(webhook => {
    const clientConfig = webhook.clientConfig.url || 
      (webhook.clientConfig.service ? 
        `${webhook.clientConfig.service.name}.${webhook.clientConfig.service.namespace}` : 
        'Unknown');
    return `${webhook.name}: ${clientConfig}`;
  });
  
  return (
    <span title={webhookDetails.join('\n')} className="cursor-help">
      {webhooks.length} webhook(s)
    </span>
  );
};