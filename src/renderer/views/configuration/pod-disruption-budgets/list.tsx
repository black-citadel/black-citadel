import { useEffect, useState } from 'react';
import { V1PodDisruptionBudgetList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { PodDisruptionBudgetList } from '@components/configuration/pod-disruption-budget/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const PodDisruptionBudgetsListView = (): JSX.Element => {
  const [pdbs, setPDBs] = useState<V1PodDisruptionBudgetList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.PodDisruptionBudgets} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.PodDisruptionBudgets, action: ResourceAction.Create})} 
          >
            Create Pod Disruption Budget
          </Button>
        }
      />
      {pdbs && <PodDisruptionBudgetList pdbs={pdbs} />}
    </>
  );
};