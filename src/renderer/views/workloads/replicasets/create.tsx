import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { ReplicaSetBadge } from '@components/workloads/replicaset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { ReplicaSetForm } from './_form';
import { dump } from 'js-yaml';

export const ReplicaSetsCreateView = (): JSX.Element => {
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
          resource: Resources.ReplicaSets,
          action: ResourceAction.Details,
          name: payload.metadata.name,
          namespace: payload.metadata.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create replica set.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.ReplicaSets,
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
        <ReplicaSetBadge />Create a New ReplicaSet
      </CreateHeader>

      <ReplicaSetForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};