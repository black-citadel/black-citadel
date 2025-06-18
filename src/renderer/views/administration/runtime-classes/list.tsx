import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { RuntimeClassList } from '@components/administration/runtime-class/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const RuntimeClassesListView = (): JSX.Element => {
  const [runtimeClasses, setRuntimeClasses] = useState<k8s.V1RuntimeClassList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listRuntimeClass();
      setRuntimeClasses(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Runtime Classes:", e);
      setError("Failed to fetch Runtime Classes.");
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
        resource={Resources.RuntimeClasses} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button 
            onClick={() => setViewContext({resource: Resources.RuntimeClasses, action: ResourceAction.Create})} 
            outline
          >
            Create Runtime Class
          </Button>
        }
      />
      {runtimeClasses && <RuntimeClassList runtimeClasses={runtimeClasses} />}
    </>
  );
};