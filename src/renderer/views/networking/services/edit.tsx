import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider'
import { ServiceBadge } from '@components/networking/service/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Service } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { ServiceForm } from './_form';

export const ServicesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<V1Service | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await window.electronAPI.readNamespacedService(viewContext.name, viewContext.namespace);
        setService(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch service:", e);
        setError("Failed to fetch service.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchService();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !service) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedService = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: service.metadata?.name,
          namespace: service.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          type: service.spec?.type, // Type is immutable
          selector: payload.spec?.selector,
          ports: payload.spec?.ports,
          sessionAffinity: payload.spec?.sessionAffinity,
          externalName: payload.spec?.externalName,
          loadBalancerIP: payload.spec?.loadBalancerIP,
          externalTrafficPolicy: payload.spec?.externalTrafficPolicy
        }
      };
      
      // Apply the updated service
      const result = await window.electronAPI.apply(dump(updatedService));

      if (result.success) {
        setViewContext({
          resource: Resources.Services,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update service.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Services,
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
        <ServiceBadge />Edit Service: {viewContext.name}
      </CreateHeader>

      {service && (
        <ServiceForm 
          service={service}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};