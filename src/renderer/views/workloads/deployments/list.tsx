import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { DeploymentList } from '@components/workloads/deployment/table';
import { Resources } from '@utils/enums';

export const DeploymentsListView = (): JSX.Element => {
  const [deployments, setDeployments] = useState<k8s.V1DeploymentList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.Deployments} error={error}  />

      {deployments && <DeploymentList deployments={deployments} />}
    </>
  );
};