import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { PodBadge } from '@components/workloads/pod/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Pod } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { PodForm } from './_form';

export const PodsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [pod, setPod] = useState<V1Pod | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchPod = async () => {
      try {
        const data = await window.electronAPI.readNamespacedPod(viewContext.name, viewContext.namespace);
        setPod(data);
      } catch (e) {
        console.error("Failed to fetch pod:", e);
        setError("Failed to fetch pod.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchPod();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !pod) return;
    try {
      // For pods, we can only update metadata (labels and annotations)
      // Most pod spec fields are immutable after creation
      const patchPayload = {
        metadata: {
          labels: payload.metadata?.labels || {},
          annotations: payload.metadata?.annotations || {}
        }
      };
      
      // Use patch to update only the metadata
      const result = await window.electronAPI.patchNamespacedPod(
        viewContext.name, 
        viewContext.namespace, 
        patchPayload
      );

      if (result.success) {
        setViewContext({
          resource: Resources.Pods,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error || "Failed to update pod. Note: Most pod specifications are immutable after creation.");
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update pod. Note: Most pod specifications are immutable after creation.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Pods,
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
        <PodBadge />Edit Pod: {viewContext.name}
      </CreateHeader>

      {pod && (
        <PodForm 
          pod={pod}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};