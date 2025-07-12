import { useEffect, useState } from 'react';
import { V1ServiceAccountList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ServiceAccountList } from '@components/access-control/service-account/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ServiceAccountsListView = (): JSX.Element => {
  const [serviceAccounts, setServiceAccounts] = useState<V1ServiceAccountList>();
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
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.ServiceAccounts, action: ResourceAction.Create})} 
            
          >
            Create Service Account
          </Button>
        }
      />
      {serviceAccounts && <ServiceAccountList serviceAccounts={serviceAccounts} />}
    </>
  );
};