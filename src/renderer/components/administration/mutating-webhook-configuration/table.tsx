import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { MutatingWebhookConfigurationResourceLink } from './resource-link';

interface Props {
  mutatingWebhookConfigurations: k8s.V1MutatingWebhookConfigurationList;
}

export const MutatingWebhookConfigurationList = ({ mutatingWebhookConfigurations }: Props): JSX.Element => {
  const headers = ['Name', 'Webhooks', 'Age'];

  const processedRows = mutatingWebhookConfigurations.items.map(mwc => ({
    Name: <MutatingWebhookConfigurationResourceLink name={mwc.metadata.name} />,
    Webhooks: formatWebhooks(mwc.webhooks),
    Age: mwc.metadata.creationTimestamp 
      ? calculateAge(new Date(mwc.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
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