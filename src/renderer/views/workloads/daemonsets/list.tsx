import { useEffect, useState } from 'react';
import { V1DaemonSetList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { DaemonSetList } from '@components/workloads/daemonset/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const DaemonSetsListView = (): JSX.Element => {
  const [daemonSets, setDaemonSets] = useState<V1DaemonSetList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.DaemonSets} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({ resource: Resources.DaemonSets, action: ResourceAction.Create})} 
          >
            Create DaemonSet
          </Button>
        }
      />

      {daemonSets && <DaemonSetList daemonSets={daemonSets} />}
    </>
  );
};