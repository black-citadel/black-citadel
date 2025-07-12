import { useEffect, useState } from 'react';
import { V1EndpointSliceList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { EndpointSliceList } from '@components/networking/endpoint-slice/table';
import { Resources } from '@utils/enums';

export const EndpointSlicesListView = (): JSX.Element => {
  const [endpointSlices, setEndpointSlices] = useState<V1EndpointSliceList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listEndpointSliceForAllNamespaces();
      setEndpointSlices(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch endpoint slices:", e);
      setError("Failed to fetch endpoint slices.");
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
        resource={Resources.EndpointSlices} 
        error={error}
        showNamespaceDropdown={true}
      />
      {endpointSlices && <EndpointSliceList endpointSlices={endpointSlices} />}
    </>
  );
};