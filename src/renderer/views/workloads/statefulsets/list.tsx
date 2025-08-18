import { useEffect, useState } from 'react';
import { V1StatefulSetList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { StatefulSetList } from '@components/workloads/statefulset/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const StatefulSetsListView = (): JSX.Element => {
  const [statefulSets, setStatefulSets] = useState<V1StatefulSetList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.StatefulSets} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.StatefulSets, action: ResourceAction.Create})} 
          >
            Create StatefulSet
          </Button>
        }
      />

      {statefulSets && <StatefulSetList statefulSets={statefulSets} />}
    </>
  );
};