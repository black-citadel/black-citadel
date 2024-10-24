import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { RoleBindingList } from '@components/access-control/role-binding/table';
import { Resources } from '@utils/enums';

export const RoleBindingsListView = (): JSX.Element => {
  const [roleBindings, setRoleBindings] = useState<k8s.V1RoleBindingList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.RoleBindings} error={error} />
      {roleBindings && <RoleBindingList roleBindings={roleBindings} />}
    </>
  );
};