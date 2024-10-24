import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { HorizontalPodAutoscalerList } from '@components/configuration/horizontal-pod-autoscaler/table';
import { Resources } from '@utils/enums';

export const HorizontalPodAutoscalersListView = (): JSX.Element => {
  const [hpas, setHPAs] = useState<k8s.V2HorizontalPodAutoscalerList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listHorizontalPodAutoscalerForAllNamespaces();
      setHPAs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Horizontal Pod Autoscalers:", e);
      setError("Failed to fetch Horizontal Pod Autoscalers.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.HorizontalPodAutoscalers} error={error} />
      {hpas && <HorizontalPodAutoscalerList hpas={hpas} />}
    </>
  );
};