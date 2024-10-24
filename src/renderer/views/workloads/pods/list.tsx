import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { PodList } from '@components/workloads/pod/table';
import { Resources } from '@utils/enums';

export const PodsListView = (): JSX.Element => {
  const [pods, setPods] = useState<k8s.V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPodForAllNamespaces();
      setPods(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch pods:", e);
      setError("Failed to fetch pods.");
    } finally {
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
      <ListHeader resource={Resources.Pods} error={error} />

      {pods && <PodList pods={pods} />}
    </>
  );
};