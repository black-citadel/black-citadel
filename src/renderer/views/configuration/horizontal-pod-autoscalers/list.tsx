import { useEffect, useState } from 'react';
import { V2HorizontalPodAutoscalerList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { HorizontalPodAutoscalerList } from '@components/configuration/horizontal-pod-autoscaler/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const HorizontalPodAutoscalersListView = (): JSX.Element => {
  const [hpas, setHPAs] = useState<V2HorizontalPodAutoscalerList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.HorizontalPodAutoscalers} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.HorizontalPodAutoscalers, action: ResourceAction.Create})} 
            
          >
            Create Horizontal Pod Autoscaler
          </Button>
        }
      />
      {hpas && <HorizontalPodAutoscalerList hpas={hpas} />}
    </>
  );
};