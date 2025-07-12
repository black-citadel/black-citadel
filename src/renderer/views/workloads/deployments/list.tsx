import { useEffect, useState } from 'react';
import { V1DeploymentList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { DeploymentList } from '@components/workloads/deployment/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const DeploymentsListView = (): JSX.Element => {
  const [deployments, setDeployments] = useState<V1DeploymentList>();
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
          <Button variant="primary"
            onClick={() => setViewContext({ resource: Resources.Deployments, action: ResourceAction.Create})} 
            
          >
            Create Deployment
          </Button>
        }
      />

      {deployments && <DeploymentList deployments={deployments} />}
    </>
  );
};