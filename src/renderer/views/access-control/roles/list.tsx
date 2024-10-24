import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { RoleList } from '@components/access-control/role/table';
import { Resources } from '@utils/enums';

export const RolesListView = (): JSX.Element => {
  const [roles, setRoles] = useState<k8s.V1RoleList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listRoleForAllNamespaces();
      setRoles(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Roles:", e);
      setError("Failed to fetch Roles.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.Roles} error={error} />
      {roles && <RoleList roles={roles} />}
    </>
  );
};