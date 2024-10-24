import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ServiceList } from '@components/networking/service/table';
import { Resources } from '@utils/enums';

export const ServicesListView = (): JSX.Element => {
  const [services, setServices] = useState<k8s.V1ServiceList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      console.log('fetch services')
      const data = await window.electronAPI.listServiceForAllNamespaces();
      setServices(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch services:", e);
      setError("Failed to fetch services.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.Services} error={error} />

      {services && <ServiceList services={services} />}
    </>
  );
};