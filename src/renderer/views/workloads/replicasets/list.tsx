import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ReplicaSetList } from '@components/workloads/replicaset/table';
import { Resources } from '@utils/enums';

export const ReplicaSetsListView = (): JSX.Element => {
  const [replicaSets, setReplicaSets] = useState<k8s.V1ReplicaSetList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listReplicaSetForAllNamespaces();
      setReplicaSets(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch replica sets:", e);
      setError("Failed to fetch replica sets.");
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
      <ListHeader resource={Resources.ReplicaSets} error={error} />

      {replicaSets && <ReplicaSetList replicaSets={replicaSets} />}
    </>
  );
};