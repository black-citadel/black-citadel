import { useEffect, useState } from 'react';
import { V1RoleBindingList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { RoleBindingList } from '@components/access-control/role-binding/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const RoleBindingsListView = (): JSX.Element => {
  const [roleBindings, setRoleBindings] = useState<V1RoleBindingList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listRoleBindingForAllNamespaces();
      setRoleBindings(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Role Bindings:", e);
      setError("Failed to fetch Role Bindings.");
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
        resource={Resources.RoleBindings} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.RoleBindings, action: ResourceAction.Create})} 
            
          >
            Create Role Binding
          </Button>
        }
      />
      {roleBindings && <RoleBindingList roleBindings={roleBindings} />}
    </>
  );
};