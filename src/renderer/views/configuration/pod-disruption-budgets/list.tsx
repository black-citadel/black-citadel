import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { PodDisruptionBudgetList } from '@components/configuration/pod-disruption-budget/table';
import { Resources } from '@utils/enums';

export const PodDisruptionBudgetsListView = (): JSX.Element => {
  const [pdbs, setPDBs] = useState<k8s.V1PodDisruptionBudgetList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPodDisruptionBudgetForAllNamespaces();
      setPDBs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Pod Disruption Budgets:", e);
      setError("Failed to fetch Pod Disruption Budgets.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.PodDisruptionBudgets} error={error} />
      {pdbs && <PodDisruptionBudgetList pdbs={pdbs} />}
    </>
  );
};