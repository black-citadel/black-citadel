import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { ValidatingWebhookConfigurationResourceLink } from './resource-link';

interface Props {
  validatingWebhookConfigurations: k8s.V1ValidatingWebhookConfigurationList;
}

export const ValidatingWebhookConfigurationList = ({ validatingWebhookConfigurations }: Props): JSX.Element => {
  const headers = ['Name', 'Webhooks', 'Failure Policy', 'Age'];

  const processedRows = validatingWebhookConfigurations.items.map(vwc => ({
    Name: <ValidatingWebhookConfigurationResourceLink name={vwc.metadata.name} />,
    Webhooks: formatWebhooks(vwc.webhooks),
    'Failure Policy': formatFailurePolicy(vwc.webhooks),
    Age: vwc.metadata.creationTimestamp 
      ? calculateAge(new Date(vwc.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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