import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { JobList } from '@components/workloads/job/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const JobsListView = (): JSX.Element => {
  const [jobs, setJobs] = useState<k8s.V1JobList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listJobForAllNamespaces();
      setJobs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
      setError("Failed to fetch jobs.");
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
        resource={Resources.Jobs} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({ resource: Resources.Jobs, action: ResourceAction.Create })} 
            outline
          >
            Create Job
          </Button>
        }
      />

      {jobs && <JobList jobs={jobs} />}
    </>
  );
};