import { useEffect, useState } from 'react';
import { V1IngressList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { IngressList } from '@components/networking/ingress/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const IngressesListView = (): JSX.Element => {
  const [ingresses, setIngresses] = useState<V1IngressList>();
  const [error, setError] = useState(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listIngressForAllNamespaces();
      setIngresses(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch ingresses:", e);
      setError("Failed to fetch ingresses.");
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
        resource={Resources.Ingresses} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({ resource: Resources.Ingresses, action: ResourceAction.Create})} 
          >
            Create Ingress
          </Button>
        }
      />

      {ingresses && <IngressList ingresses={ingresses} />}
    </>
  );
};