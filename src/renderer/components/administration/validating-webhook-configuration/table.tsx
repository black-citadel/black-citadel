import { useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { ValidatingWebhookConfigurationResourceLink } from './resource-link';

interface Props {
  validatingWebhookConfigurations: k8s.V1ValidatingWebhookConfigurationList;
}

export const ValidatingWebhookConfigurationList = ({ validatingWebhookConfigurations }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  const headers = ['Name', 'Webhooks', 'Failure Policy', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows = validatingWebhookConfigurations.items.map(vwc => ({
    Name: vwc.metadata.name || '',
    Webhooks: vwc.webhooks?.length || 0,
    'Failure Policy': vwc.webhooks?.map(w => w.failurePolicy || 'Fail').join(', ') || '',
    Age: vwc.metadata.creationTimestamp || '',
    _raw: vwc
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to React components
  const processedRows = sortedRows.map(row => ({
    Name: <ValidatingWebhookConfigurationResourceLink name={row._raw.metadata.name} />,
    Webhooks: formatWebhooks(row._raw.webhooks),
    'Failure Policy': formatFailurePolicy(row._raw.webhooks),
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
const formatWebhooks = (webhooks: k8s.V1ValidatingWebhook[] | undefined): JSX.Element => {
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

// Helper function to format failure policy
const formatFailurePolicy = (webhooks: k8s.V1ValidatingWebhook[] | undefined): JSX.Element => {
  if (!webhooks || webhooks.length === 0) return <span>-</span>;
  
  const policies = webhooks.map(webhook => webhook.failurePolicy || 'Fail');
  const uniquePolicies = [...new Set(policies)];
  
  const policyDetails = webhooks.map(webhook => 
    `${webhook.name}: ${webhook.failurePolicy || 'Fail'}`
  );
  
  return (
    <span title={policyDetails.join('\n')} className="cursor-help">
      {uniquePolicies.join(', ')}
    </span>
  );
};