import { useEffect, useState } from 'react';
import { V1ValidatingWebhookConfigurationList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ValidatingWebhookConfigurationList } from '@components/administration/validating-webhook-configuration/table';
import { Resources } from '@utils/enums';

export const ValidatingWebhookConfigurationsListView = (): JSX.Element => {
  const [validatingWebhookConfigs, setValidatingWebhookConfigs] = useState<V1ValidatingWebhookConfigurationList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listValidatingWebhookConfiguration();
      setValidatingWebhookConfigs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Validating Webhook Configurations:", e);
      setError("Failed to fetch Validating Webhook Configurations.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader 
        resource={Resources.ValidatingWebhookConfigurations} 
        error={error}
        showNamespaceDropdown={false}
      />
      {validatingWebhookConfigs && <ValidatingWebhookConfigurationList validatingWebhookConfigurations={validatingWebhookConfigs} />}
    </>
  );
};