import { useEffect, useState } from 'react';
import { V1EndpointsList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { EndpointsList } from '@components/networking/endpoint/table';
import { useView } from '@context/viewProvider';

export const EndpointsListView = (): JSX.Element => {
  const [endpoints, setEndpoints] = useState<V1EndpointsList>();
  const [error, setError] = useState<string | null>(null);
  const { __setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.Endpoints} 
        error={error}
        showNamespaceDropdown={true}
      />
      {endpoints && <EndpointsList endpoints={endpoints} />}
    </>
  );
};