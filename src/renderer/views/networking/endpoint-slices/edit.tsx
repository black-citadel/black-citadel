import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { EndpointSliceBadge } from '@components/networking/endpoint-slice/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1EndpointSlice } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { EndpointSlicesForm } from './_form';

export const EndpointSlicesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [endpointSlice, setEndpointSlice] = useState<V1EndpointSlice | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchEndpointSlice = async () => {
      try {
        const data = await window.electronAPI.readNamespacedEndpointSlice(viewContext.name, viewContext.namespace);
        setEndpointSlice(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch endpoint slice:", e);
        setError("Failed to fetch endpoint slice.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchEndpointSlice();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !endpointSlice) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedEndpointSlice = {
        apiVersion: 'discovery.k8s.io/v1',
        kind: 'EndpointSlice',
        metadata: {
          name: endpointSlice.metadata?.name,
          namespace: endpointSlice.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        addressType: endpointSlice.addressType, // addressType is immutable
        endpoints: payload.endpoints,
        ports: payload.ports
      };
      
      // Apply the updated endpoint slice
      const result = await window.electronAPI.apply(dump(updatedEndpointSlice));

      if (result.success) {
        setViewContext({
          resource: Resources.EndpointSlices,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update endpoint slice.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.EndpointSlices,
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
        <EndpointSliceBadge />Edit Endpoint Slice: {viewContext.name}
      </CreateHeader>

      {endpointSlice && (
        <EndpointSlicesForm 
          endpointSlice={endpointSlice}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};