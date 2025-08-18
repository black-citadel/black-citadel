import { useEffect, useState } from 'react';
import { V1EndpointSliceList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { EndpointSliceList } from '@components/networking/endpoint-slice/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const EndpointSlicesListView = (): JSX.Element => {
  const [endpointSlices, setEndpointSlices] = useState<V1EndpointSliceList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
        actions={
          <Button variant="primary" onClick={() => setViewContext({resource: Resources.EndpointSlices, action: ResourceAction.Create})}>
            Create EndpointSlice
          </Button>
        }
      />
      {endpointSlices && <EndpointSliceList endpointSlices={endpointSlices} />}
    </>
  );
};