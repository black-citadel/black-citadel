import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { EndpointsList } from '@components/networking/endpoint/table';
import { Resources } from '@utils/enums';

export const EndpointsListView = (): JSX.Element => {
  const [endpoints, setEndpoints] = useState<k8s.V1EndpointsList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listEndpointsForAllNamespaces();
      setEndpoints(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch endpoints:", e);
      setError("Failed to fetch endpoints.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.Endpoints} error={error} />
      {endpoints && <EndpointsList endpoints={endpoints} />}
    </>
  );
};