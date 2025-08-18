import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { V1NetworkPolicy } from '@utils/k8s-types';
import { dump } from 'js-yaml';
import { NetworkPolicyForm } from './_form';

export const NetworkPoliciesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [networkPolicy, setNetworkPolicy] = useState<V1NetworkPolicy | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchNetworkPolicy = async () => {
      try {
        const data = await window.electronAPI.readNamespacedNetworkPolicy(viewContext.name, viewContext.namespace);
        setNetworkPolicy(data);
        setPayload(data); // Initialize payload with fetched data
      } catch (e) {
        console.error("Failed to fetch network policy:", e);
        setError("Failed to fetch network policy.");
      }
    };

    if (viewContext.name && viewContext.namespace) {
      fetchNetworkPolicy();
    }
  }, [viewContext.name, viewContext.namespace]);

  const handleUpdate = async () => {
    if (!payload || !networkPolicy) return;
    try {
      // Build a clean update payload with only the necessary fields
      const updatedNetworkPolicy = {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'NetworkPolicy',
        metadata: {
          name: networkPolicy.metadata?.name,
          namespace: networkPolicy.metadata?.namespace,
          labels: payload.metadata?.labels,
          annotations: payload.metadata?.annotations,
        },
        spec: {
          podSelector: payload.spec?.podSelector,
          policyTypes: payload.spec?.policyTypes,
          ingress: payload.spec?.ingress,
          egress: payload.spec?.egress
        }
      };
      
      // Apply the updated network policy
      const result = await window.electronAPI.apply(dump(updatedNetworkPolicy));

      if (result.success) {
        setViewContext({
          resource: Resources.NetworkPolicies,
          action: ResourceAction.Details,
          name: viewContext.name,
          namespace: viewContext.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update network policy.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.NetworkPolicies,
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
        <NetworkPolicyBadge />Edit Network Policy: {viewContext.name}
      </CreateHeader>

      {networkPolicy && (
        <NetworkPolicyForm 
          networkPolicy={networkPolicy}
          onChange={setPayload}
          isEdit={true}
        />
      )}
    </>
  );
};