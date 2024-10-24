import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { MutatingWebhookConfigurationList } from '@components/administration/mutating-webhook-configuration/table';
import { Resources } from '@utils/enums';


export const MutatingWebhookConfigurationsListView = (): JSX.Element => {
  const [mutatingWebhookConfigs, setMutatingWebhookConfigs] = useState<k8s.V1MutatingWebhookConfigurationList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listMutatingWebhookConfiguration();
      setMutatingWebhookConfigs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Mutating Webhook Configurations:", e);
      setError("Failed to fetch Mutating Webhook Configurations.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.MutatingWebhookConfigurations} error={error} />
      {mutatingWebhookConfigs && <MutatingWebhookConfigurationList mutatingWebhookConfigurations={mutatingWebhookConfigs} />}
    </>
  );
};