import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { IngressClassBadge } from '@components/networking/ingress-class/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1IngressClass } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { IngressClassForm } from './_form';

export const IngressClassesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [ingressClass, setIngressClass] = useState<V1IngressClass | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchIngressClass = async () => {
      try {
        const data = await window.electronAPI.readIngressClass(viewContext.name);
        setIngressClass(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch ingress class:", e);
        setError("Failed to fetch ingress class.");
      }
    };

    if (viewContext.name) {
      fetchIngressClass();
    }
  }, [viewContext.name]);

  const handleUpdate = async () => {
    if (!payload || !ingressClass) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedIngressClass = {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'IngressClass',
        metadata: {
          name: ingressClass.metadata?.name,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          controller: ingressClass.spec?.controller, // Controller is immutable
          parameters: payload.spec?.parameters
        }
      };
      
      // Apply the updated ingress class
      const result = await window.electronAPI.apply(dump(updatedIngressClass));

      if (result.success) {
        setViewContext({
          resource: Resources.IngressClasses,
          action: ResourceAction.Details,
          name: viewContext.name
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update ingress class.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.IngressClasses,
      action: ResourceAction.Details,
      name: viewContext.name
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
        <IngressClassBadge />Edit Ingress Class: {viewContext.name}
      </CreateHeader>

      {ingressClass && (
        <IngressClassForm 
          ingressClass={ingressClass}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};