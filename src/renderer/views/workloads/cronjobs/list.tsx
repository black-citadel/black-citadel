import { useEffect, useState } from 'react';
import { V1CronJobList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { CronJobList } from '@components/workloads/cronjob/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const CronJobsListView = (): JSX.Element => {
  const [cronJobs, setCronJobs] = useState<V1CronJobList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listCronJobForAllNamespaces();
      setCronJobs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch cron jobs:", e);
      setError("Failed to fetch cron jobs.");
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
        resource={Resources.CronJobs} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.CronJobs, action: ResourceAction.Create})} 
            
          >
            Create CronJob
          </Button>
        }
      />

      {cronJobs && <CronJobList cronJobs={cronJobs} />}
    </>
  );
};