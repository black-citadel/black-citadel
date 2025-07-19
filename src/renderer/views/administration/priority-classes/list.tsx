import { useEffect, useState } from 'react';
import { V1PriorityClassList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { PriorityClassList } from '@components/administration/priority-class/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const PriorityClassesListView = (): JSX.Element => {
  const [priorityClasses, setPriorityClasses] = useState<V1PriorityClassList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPriorityClass();
      setPriorityClasses(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Priority Classes:", e);
      setError("Failed to fetch Priority Classes.");
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
        resource={Resources.PriorityClasses} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.PriorityClasses, action: ResourceAction.Create})} 
          >
            Create Priority Class
          </Button>
        }
      />
      {priorityClasses && <PriorityClassList priorityClasses={priorityClasses} />}
    </>
  );
};