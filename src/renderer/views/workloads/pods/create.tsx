import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { PodBadge } from '@components/workloads/pod/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { PodForm } from './_form';
import { CodePanel } from '@components/code';
import { dump } from 'js-yaml';

export const PodsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      const result = await window.electronAPI.createNamespacedPod(payload.metadata.namespace, payload);

      if (result.success) {
        setViewContext({
          resource: Resources.Pods,
          action: ResourceAction.Details,
          name: result.data.metadata.name,
          namespace: result.data.metadata.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create pod.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Pods,
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
        <PodBadge />Create a New Pod
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <PodForm 
            onChange={setPayload}
            isEdit={false}
          />
        </div>
        
        <div className='px-4'>
          {payload && (
            <CodePanel code={dump(payload)}>
              <code>{dump(payload)}</code>
            </CodePanel>
          )}
        </div>
      </div>
    </>
  );
};
