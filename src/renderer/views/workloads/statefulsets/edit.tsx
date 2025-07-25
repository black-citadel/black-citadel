import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { StatefulSetBadge } from '@components/workloads/statefulset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1StatefulSet } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { StatefulSetForm } from './_form';

export const StatefulSetsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [statefulSet, setStatefulSet] = useState<V1StatefulSet | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchStatefulSet = async () => {
      try {
        const data = await window.electronAPI.readNamespacedStatefulSet(viewContext.name, viewContext.namespace);
        setStatefulSet(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch stateful set:", e);
        setError("Failed to fetch stateful set.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchStatefulSet();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !statefulSet) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedStatefulSet = {
        apiVersion: 'apps/v1',
        kind: 'StatefulSet',
        metadata: {
          name: statefulSet.metadata?.name,
          namespace: statefulSet.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          replicas: payload.spec?.replicas,
          selector: statefulSet.spec?.selector, // Preserve the immutable selector
          serviceName: statefulSet.spec?.serviceName, // Preserve the immutable serviceName
          template: {
            metadata: {
              labels: {
                ...statefulSet.spec?.selector?.matchLabels, // Ensure selector labels are preserved
                ...payload.spec?.template?.metadata?.labels
              }
            },
            spec: payload.spec?.template?.spec
          }
        }
      };
      
      // Apply the updated stateful set
      const result = await window.electronAPI.apply(dump(updatedStatefulSet));

      if (result.success) {
        setViewContext({
          resource: Resources.StatefulSets,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update stateful set.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.StatefulSets,
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
        <StatefulSetBadge />Edit StatefulSet: {viewContext.name}
      </CreateHeader>

      {statefulSet && (
        <StatefulSetForm 
          statefulSet={statefulSet}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};