import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListHeader } from '@components/list-header';
import { NamespaceList } from '@components/cluster/namespace/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const NamespacesListView = () => {
  const [namespaces, setNamespaces] = useState<k8s.V1NamespaceList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.Namespaces} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button 
            onClick={() => setViewContext({resource: Resources.Namespaces, action: ResourceAction.Create})} 
            outline
          >
            Create Namespace
          </Button>
        }
      />
      {namespaces && <NamespaceList namespaces={namespaces} />}
    </>
  );
};

export default NamespacesListView;