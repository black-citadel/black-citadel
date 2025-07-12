import { useEffect, useState } from 'react';
import { V1PodList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { PodList } from '@components/workloads/pod/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const PodsListView = (): JSX.Element => {
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.Pods} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary" onClick={() => setViewContext({resource: Resources.Pods, action: ResourceAction.Create})}>
            Create Pod
          </Button>
        }
      />

      {pods && <PodList pods={pods} />}
    </>
  );
};