import { useEffect, useState } from 'react';
import { V1ResourceQuotaList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ResourceQuotaList } from '@components/configuration/resource-quota/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ResourceQuotasListView = (): JSX.Element => {
  const [resourceQuotas, setResourceQuotas] = useState<V1ResourceQuotaList>();
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
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.ResourceQuotas, action: ResourceAction.Create})} 
          >
            Create Resource Quota
          </Button>
        }
      />
      {resourceQuotas && <ResourceQuotaList resourceQuotas={resourceQuotas} />}
    </>
  );
};