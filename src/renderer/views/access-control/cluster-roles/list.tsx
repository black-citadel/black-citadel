import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ClusterRoleList } from '@components/access-control/cluster-role/table';
import { Resources } from '@utils/enums';

export const ClusterRolesListView = (): JSX.Element => {
  const [clusterRoles, setClusterRoles] = useState<k8s.V1ClusterRoleList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.ClusterRoles} error={error} />
      {clusterRoles && <ClusterRoleList clusterRoles={clusterRoles} />}
    </>
  );
};