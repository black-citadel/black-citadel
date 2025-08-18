import { useEffect, useState } from 'react';
import { V1ClusterRoleList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ClusterRoleList } from '@components/access-control/cluster-role/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ClusterRolesListView = (): JSX.Element => {
  const [clusterRoles, setClusterRoles] = useState<V1ClusterRoleList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listClusterRole();
      setClusterRoles(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Cluster Roles:", e);
      setError("Failed to fetch Cluster Roles.");
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
        resource={Resources.ClusterRoles} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.ClusterRoles, action: ResourceAction.Create})} 
            
          >
            Create Cluster Role
          </Button>
        }
      />
      {clusterRoles && <ClusterRoleList clusterRoles={clusterRoles} />}
    </>
  );
};