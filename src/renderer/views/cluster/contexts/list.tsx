import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { ContextList } from '@components/cluster/context/table';

export const ContextsListView = (): JSX.Element => {
  const [contexts, setContexts] = useState<k8s.Context[]>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.getContexts();
      setContexts(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch deployments:", e);
      setError("Failed to fetch deployments.");
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
      <ListHeader resource={Resources.Contexts} error={error}  />

      {contexts && <ContextList contexts={contexts} />}
    </>
  );
};