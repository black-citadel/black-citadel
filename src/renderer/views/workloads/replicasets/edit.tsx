import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { ReplicaSetBadge } from '@components/workloads/replicaset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1ReplicaSet } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { ReplicaSetForm } from './_form';

export const ReplicaSetsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [replicaSet, setReplicaSet] = useState<V1ReplicaSet | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchReplicaSet = async () => {
      try {
        const data = await window.electronAPI.readNamespacedReplicaSet(viewContext.name, viewContext.namespace);
        setReplicaSet(data);
      } catch (e) {
        console.error("Failed to fetch replica set:", e);
        setError("Failed to fetch replica set.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchReplicaSet();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !replicaSet) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedReplicaSet = {
        apiVersion: 'apps/v1',
        kind: 'ReplicaSet',
        metadata: {
          name: replicaSet.metadata?.name,
          namespace: replicaSet.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          replicas: payload.spec?.replicas,
          selector: replicaSet.spec?.selector, // Preserve the immutable selector
          template: {
            metadata: {
              labels: {
                ...replicaSet.spec?.selector?.matchLabels, // Ensure selector labels are preserved
                ...payload.spec?.template?.metadata?.labels
              }
            },
            spec: payload.spec?.template?.spec
          }
        }
      };
      
      // Apply the updated replica set
      const result = await window.electronAPI.apply(dump(updatedReplicaSet));

      if (result.success) {
        setViewContext({
          resource: Resources.ReplicaSets,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update replica set.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.ReplicaSets,
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
        <ReplicaSetBadge />Edit ReplicaSet: {viewContext.name}
      </CreateHeader>

      {replicaSet && (
        <ReplicaSetForm 
          replicaSet={replicaSet}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};