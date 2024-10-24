import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { DaemonSetList } from '@components/workloads/daemonset/table';
import { Resources } from '@utils/enums';

export const DaemonSetsListView = (): JSX.Element => {
  const [daemonSets, setDaemonSets] = useState<k8s.V1DaemonSetList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listDaemonSetForAllNamespaces();
      setDaemonSets(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch daemon sets:", e);
      setError("Failed to fetch daemon sets.");
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
      <ListHeader resource={Resources.DaemonSets} error={error} />

      {daemonSets && <DaemonSetList daemonSets={daemonSets} />}
    </>
  );
};