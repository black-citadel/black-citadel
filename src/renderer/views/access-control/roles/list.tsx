import { useEffect, useState } from 'react';
import { V1RoleList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { RoleList } from '@components/access-control/role/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const RolesListView = (): JSX.Element => {
  const [roles, setRoles] = useState<V1RoleList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.Roles} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.Roles, action: ResourceAction.Create})} 
            
          >
            Create Role
          </Button>
        }
      />
      {roles && <RoleList roles={roles} />}
    </>
  );
};