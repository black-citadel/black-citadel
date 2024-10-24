import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListHeader } from '@components/list-header';
import { NamespaceList } from '@components/cluster/namespace/table';
import { Resources } from '@utils/enums';

export const NamespacesListView = () => {
  const [namespaces, setNamespaces] = useState<k8s.V1NamespaceList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listNamespace();
      setNamespaces(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Namespaces:", e);
      setError("Failed to fetch Namespaces.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.Namespaces} error={error} />
      {namespaces && <NamespaceList namespaces={namespaces} />}
    </>
  );
};

export default NamespacesListView;