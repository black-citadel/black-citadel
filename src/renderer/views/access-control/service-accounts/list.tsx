import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ServiceAccountList } from '@components/access-control/service-account/table';
import { Resources } from '@utils/enums';

export const ServiceAccountsListView = (): JSX.Element => {
  const [serviceAccounts, setServiceAccounts] = useState<k8s.V1ServiceAccountList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.ServiceAccounts} error={error} />
      {serviceAccounts && <ServiceAccountList serviceAccounts={serviceAccounts} />}
    </>
  );
};