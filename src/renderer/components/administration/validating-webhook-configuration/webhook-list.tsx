import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface WebhookListProps {
  webhooks?: k8s.V1ValidatingWebhook[];
}

export const WebhookList = ({ webhooks }: WebhookListProps): JSX.Element => {
  if (!webhooks || webhooks.length === 0) {
    return <DetailsItem label="Webhooks">None</DetailsItem>;
  }

  return (
    <DetailsItem label="Webhooks">
      {webhooks.map((webhook, index) => (
        <div key={index} className="mb-4 p-2 border border-gray-200 rounded">
          <div className="font-bold">Name: {webhook.name}</div>
          <div>Client Config:</div>
          <div className="ml-4">
            <div>URL: {webhook.clientConfig.url}</div>
            <div>Service: {webhook.clientConfig.service?.name} in {webhook.clientConfig.service?.namespace}</div>
            <div>Path: {webhook.clientConfig.service?.path}</div>
          </div>
          <div>Failure Policy: {webhook.failurePolicy}</div>
          <div>Match Policy: {webhook.matchPolicy}</div>
          <div>Admission Review Versions: {webhook.admissionReviewVersions?.join(', ')}</div>
          <div>Side Effects: {webhook.sideEffects}</div>
          <div>Timeout Seconds: {webhook.timeoutSeconds}</div>
          <div>Rules:</div>
          <div className="ml-4">
            {webhook.rules?.map((rule, ruleIndex) => (
              <div key={ruleIndex}>
                <div>API Groups: {rule.apiGroups?.join(', ')}</div>
                <div>API Versions: {rule.apiVersions?.join(', ')}</div>
                <div>Resources: {rule.resources?.join(', ')}</div>
                <div>Operations: {rule.operations?.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DetailsItem>
  );
};