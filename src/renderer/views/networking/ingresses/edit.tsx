import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { IngressBadge } from '@components/networking/ingress/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1Ingress } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { IngressForm } from './_form';

export const IngressesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [ingress, setIngress] = useState<V1Ingress | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchIngress = async () => {
      try {
        const data = await window.electronAPI.readNamespacedIngress(viewContext.name, viewContext.namespace);
        setIngress(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch ingress:", e);
        setError("Failed to fetch ingress.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchIngress();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !ingress) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedIngress = {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: {
          name: ingress.metadata?.name,
          namespace: ingress.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          ingressClassName: payload.spec?.ingressClassName,
          rules: payload.spec?.rules,
          tls: payload.spec?.tls
        }
      };
      
      // Apply the updated ingress
      const result = await window.electronAPI.apply(dump(updatedIngress));

      if (result.success) {
        setViewContext({
          resource: Resources.Ingresses,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update ingress.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Ingresses,
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
        <IngressBadge />Edit Ingress: {viewContext.name}
      </CreateHeader>

      {ingress && (
        <IngressForm 
          ingress={ingress}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};