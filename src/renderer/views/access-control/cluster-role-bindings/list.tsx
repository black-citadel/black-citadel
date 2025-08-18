import { useEffect, useState } from 'react';
import { V1ClusterRoleBindingList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ClusterRoleBindingList } from '@components/access-control/cluster-role-binding/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ClusterRoleBindingsListView = (): JSX.Element => {
  const [clusterRoleBindings, setClusterRoleBindings] = useState<V1ClusterRoleBindingList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listClusterRoleBinding();
      setClusterRoleBindings(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Cluster Role Bindings:", e);
      setError("Failed to fetch Cluster Role Bindings.");
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
        resource={Resources.ClusterRoleBindings} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.ClusterRoleBindings, action: ResourceAction.Create})} 
          >
            Create Cluster Role Binding
          </Button>
        }
      />
      {clusterRoleBindings && <ClusterRoleBindingList clusterRoleBindings={clusterRoleBindings} />}
    </>
  );
};