import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { StatefulSetList } from '@components/workloads/statefulset/table';
import { Resources } from '@utils/enums';

export const StatefulSetsListView = (): JSX.Element => {
  const [statefulSets, setStatefulSets] = useState<k8s.V1StatefulSetList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listStatefulSetForAllNamespaces();
      setStatefulSets(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch stateful sets:", e);
      setError("Failed to fetch stateful sets.");
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
      <ListHeader resource={Resources.StatefulSets} error={error} />

      {statefulSets && <StatefulSetList statefulSets={statefulSets} />}
    </>
  );
};