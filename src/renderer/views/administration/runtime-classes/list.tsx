import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { RuntimeClassList } from '@components/administration/runtime-class/table';
import { Resources } from '@utils/enums';

export const RuntimeClassesListView = (): JSX.Element => {
  const [runtimeClasses, setRuntimeClasses] = useState<k8s.V1RuntimeClassList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.RuntimeClasses} error={error} />
      {runtimeClasses && <RuntimeClassList runtimeClasses={runtimeClasses} />}
    </>
  );
};