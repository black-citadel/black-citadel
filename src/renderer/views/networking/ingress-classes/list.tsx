import { useEffect, useState } from 'react';
import { V1IngressClassList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { IngressClassList } from '@components/networking/ingress-class/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const IngressClassesListView = (): JSX.Element => {
  const [ingressClasses, setIngressClasses] = useState<V1IngressClassList>();
  const [error, setError] = useState(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listIngressClass();
      setIngressClasses(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch ingresses:", e);
      setError("Failed to fetch ingresses.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => { fetchData(); }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader 
        resource={Resources.IngressClasses} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({ resource: Resources.IngressClasses, action: ResourceAction.Create})} 
          >
            Create Ingress Class
          </Button>
        }
      />

      {ingressClasses && <IngressClassList ingressClasses={ingressClasses} />}
    </>
  );
};