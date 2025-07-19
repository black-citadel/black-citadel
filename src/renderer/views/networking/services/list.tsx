import { useEffect, useState } from 'react';
import { V1ServiceList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ServiceList } from '@components/networking/service/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ServicesListView = (): JSX.Element => {
  const [services, setServices] = useState<V1ServiceList>();
  const [error, setError] = useState(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
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
      <ListHeader 
        resource={Resources.Services} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.Services, action: ResourceAction.Create})} 
          >
            Create Service
          </Button>
        }
      />

      {services && <ServiceList services={services} />}
    </>
  );
};