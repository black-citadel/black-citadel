import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ServiceAccountList } from '@components/access-control/service-account/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ServiceAccountsListView = (): JSX.Element => {
  const [serviceAccounts, setServiceAccounts] = useState<k8s.V1ServiceAccountList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listServiceAccountForAllNamespaces();
      setServiceAccounts(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Service Accounts:", e);
      setError("Failed to fetch Service Accounts.");
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
        resource={Resources.ServiceAccounts} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({resource: Resources.ServiceAccounts, action: ResourceAction.Create})} 
            outline
          >
            Create Service Account
          </Button>
        }
      />
      {serviceAccounts && <ServiceAccountList serviceAccounts={serviceAccounts} />}
    </>
  );
};