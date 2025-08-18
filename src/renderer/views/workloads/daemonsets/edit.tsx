import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1DaemonSet } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { DaemonSetForm } from './_form';

export const DaemonSetsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [daemonSet, setDaemonSet] = useState<V1DaemonSet | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchDaemonSet = async () => {
      try {
        const data = await window.electronAPI.readNamespacedDaemonSet(viewContext.name, viewContext.namespace);
        setDaemonSet(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch daemon set:", e);
        setError("Failed to fetch daemon set.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchDaemonSet();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !daemonSet) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedDaemonSet = {
        apiVersion: 'apps/v1',
        kind: 'DaemonSet',
        metadata: {
          name: daemonSet.metadata?.name,
          namespace: daemonSet.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          selector: daemonSet.spec?.selector, // Preserve the immutable selector
          template: {
            metadata: {
              labels: {
                ...daemonSet.spec?.selector?.matchLabels, // Ensure selector labels are preserved
                ...payload.spec?.template?.metadata?.labels
              }
            },
            spec: payload.spec?.template?.spec
          }
        }
      };
      
      // Apply the updated daemon set
      const result = await window.electronAPI.apply(dump(updatedDaemonSet));

      if (result.success) {
        setViewContext({
          resource: Resources.DaemonSets,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update daemon set.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.DaemonSets,
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
        <DaemonSetBadge />Edit DaemonSet: {viewContext.name}
      </CreateHeader>

      {daemonSet && (
        <DaemonSetForm 
          daemonSet={daemonSet}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};