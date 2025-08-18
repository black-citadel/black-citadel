import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { DeploymentBadge } from '@components/workloads/deployment/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Deployment } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { DeploymentForm } from './_form';

export const DeploymentsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [deployment, setDeployment] = useState<V1Deployment | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const data = await window.electronAPI.readNamespacedDeployment(viewContext.name, viewContext.namespace);
        setDeployment(data);
      } catch (e) {
        console.error("Failed to fetch deployment:", e);
        setError("Failed to fetch deployment.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchDeployment();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !deployment) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedDeployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: deployment.metadata?.name,
          namespace: deployment.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          replicas: payload.spec?.replicas,
          selector: deployment.spec?.selector, // Preserve the immutable selector
          template: {
            metadata: {
              labels: {
                ...deployment.spec?.selector?.matchLabels, // Ensure selector labels are preserved
                ...payload.spec?.template?.metadata?.labels
              }
            },
            spec: payload.spec?.template?.spec
          }
        }
      };
      
      // Apply the updated deployment
      const result = await window.electronAPI.apply(dump(updatedDeployment));

      if (result.success) {
        setViewContext({
          resource: Resources.Deployments,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update deployment.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Deployments,
      action: ResourceAction.Details,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Update</Button>
          </>
        }
      >
        <DeploymentBadge />Edit Deployment: {viewContext.name}
      </CreateHeader>

      {deployment && (
        <DeploymentForm 
          deployment={deployment}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};