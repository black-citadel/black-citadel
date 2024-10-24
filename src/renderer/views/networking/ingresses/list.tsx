import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { IngressList } from '@components/networking/ingress/table';
import { Resources } from '@utils/enums';

export const IngressesListView = (): JSX.Element => {
  const [ingresses, setIngresses] = useState<k8s.V1IngressList>();
  const [error, setError] = useState(null);

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
      <ListHeader resource={Resources.Ingresses} error={error} />

      {ingresses && <IngressList ingresses={ingresses} />}
    </>
  );
};