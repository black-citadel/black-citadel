import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ReplicaSetList } from '@components/workloads/replicaset/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ReplicaSetsListView = (): JSX.Element => {
  const [replicaSets, setReplicaSets] = useState<k8s.V1ReplicaSetList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.ReplicaSets} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({resource: Resources.ReplicaSets, action: ResourceAction.Create})} 
            outline
          >
            Create ReplicaSet
          </Button>
        }
      />

      {replicaSets && <ReplicaSetList replicaSets={replicaSets} />}
    </>
  );
};