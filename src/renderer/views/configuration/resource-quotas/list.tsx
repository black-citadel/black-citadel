import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ResourceQuotaList } from '@components/configuration/resource-quota/table';
import { Resources } from '@utils/enums';

export const ResourceQuotasListView = (): JSX.Element => {
  const [resourceQuotas, setResourceQuotas] = useState<k8s.V1ResourceQuotaList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listResourceQuotaForAllNamespaces();
      setResourceQuotas(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch resource quotas:", e);
      setError("Failed to fetch resource quotas.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.ResourceQuotas} error={error} />
      {resourceQuotas && <ResourceQuotaList resourceQuotas={resourceQuotas} />}
    </>
  );
};