import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { DeploymentBadge } from '@components/workloads/deployment/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { DeploymentForm } from './_form';
import { dump } from 'js-yaml';

export const DeploymentsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Deployments,
          action: ResourceAction.Details,
          name: payload.metadata.name,
          namespace: payload.metadata.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create deployment.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Deployments,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <DeploymentBadge />Create a New Deployment
      </CreateHeader>

      <DeploymentForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};