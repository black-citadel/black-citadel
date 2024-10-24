import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { PriorityClassList } from '@components/administration/priority-class/table';
import { Resources } from '@utils/enums';

export const PriorityClassesListView = (): JSX.Element => {
  const [priorityClasses, setPriorityClasses] = useState<k8s.V1PriorityClassList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.PriorityClasses} error={error} />
      {priorityClasses && <PriorityClassList priorityClasses={priorityClasses} />}
    </>
  );
};