import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { IngressClassList } from '@components/networking/ingress-class/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const IngressClassesListView = (): JSX.Element => {
  const [ingressClasses, setIngressClasses] = useState<k8s.V1IngressClassList>();
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
          <Button 
            onClick={() => setViewContext({ resource: Resources.IngressClasses, action: ResourceAction.Create})} 
            outline
          >
            Create Ingress Class
          </Button>
        }
      />

      {ingressClasses && <IngressClassList ingressClasses={ingressClasses} />}
    </>
  );
};