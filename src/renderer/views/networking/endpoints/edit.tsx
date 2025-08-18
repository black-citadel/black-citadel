import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { EndpointBadge } from '@components/networking/endpoint/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Endpoints } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { EndpointsForm } from './_form';

export const EndpointsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<V1Endpoints | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const data = await window.electronAPI.readNamespacedEndpoints(viewContext.name, viewContext.namespace);
        setEndpoints(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch endpoints:", e);
        setError("Failed to fetch endpoints.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchEndpoints();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !endpoints) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedEndpoints = {
        apiVersion: 'v1',
        kind: 'Endpoints',
        metadata: {
          name: endpoints.metadata?.name,
          namespace: endpoints.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        subsets: payload.subsets
      };
      
      // Apply the updated endpoints
      const result = await window.electronAPI.apply(dump(updatedEndpoints));

      if (result.success) {
        setViewContext({
          resource: Resources.Endpoints,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update endpoints.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Endpoints,
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
        <EndpointBadge />Edit Endpoints: {viewContext.name}
      </CreateHeader>

      {endpoints && (
        <EndpointsForm 
          endpoints={endpoints}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};