import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ResourceQuotaList } from '@components/configuration/resource-quota/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ResourceQuotasListView = (): JSX.Element => {
  const [resourceQuotas, setResourceQuotas] = useState<k8s.V1ResourceQuotaList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.ResourceQuotas} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({resource: Resources.ResourceQuotas, action: ResourceAction.Create})} 
            outline
          >
            Create Resource Quota
          </Button>
        }
      />
      {resourceQuotas && <ResourceQuotaList resourceQuotas={resourceQuotas} />}
    </>
  );
};