import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { DeploymentList } from '@components/workloads/deployment/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const DeploymentsListView = (): JSX.Element => {
  const [deployments, setDeployments] = useState<k8s.V1DeploymentList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listDeploymentForAllNamespaces();
      setDeployments(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch deployments:", e);
      setError("Failed to fetch deployments.");
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
        resource={Resources.Deployments} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({ resource: Resources.Deployments, action: ResourceAction.Create})} 
            outline
          >
            Create Deployment
          </Button>
        }
      />

      {deployments && <DeploymentList deployments={deployments} />}
    </>
  );
};