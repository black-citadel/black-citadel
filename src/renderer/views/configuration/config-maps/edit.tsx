import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { ConfigMapBadge } from '@components/configuration/config-map/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1ConfigMap } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { ConfigMapForm } from './_form';

export const ConfigMapsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [configMap, setConfigMap] = useState<V1ConfigMap | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchConfigMap = async () => {
      try {
        const data = await window.electronAPI.readNamespacedConfigMap(viewContext.name, viewContext.namespace);
        setConfigMap(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch ConfigMap:", e);
        setError("Failed to fetch ConfigMap.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchConfigMap();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !configMap) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedConfigMap = {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: configMap.metadata?.name,
          namespace: configMap.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        data: payload.data || {},
        binaryData: configMap.binaryData // Preserve binaryData if it exists
      };
      
      // Apply the updated ConfigMap
      const result = await window.electronAPI.apply(dump(updatedConfigMap));

      if (result.success) {
        setViewContext({
          resource: Resources.ConfigMaps,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update ConfigMap.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.ConfigMaps,
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
        <ConfigMapBadge />Edit ConfigMap: {viewContext.name}
      </CreateHeader>

      {configMap && (
        <ConfigMapForm 
          configMap={configMap}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};