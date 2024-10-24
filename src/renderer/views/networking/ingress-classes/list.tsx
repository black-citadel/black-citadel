import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { IngressClassList } from '@components/networking/ingress-class/table';
import { Resources } from '@utils/enums';

export const IngressClassesListView = (): JSX.Element => {
  const [ingressClasses, setIngressClasses] = useState<k8s.V1IngressClassList>();
  const [error, setError] = useState(null);

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
      <ListHeader resource={Resources.IngressClasses} error={error} />

      {ingressClasses && <IngressClassList ingressClasses={ingressClasses} />}
    </>
  );
};