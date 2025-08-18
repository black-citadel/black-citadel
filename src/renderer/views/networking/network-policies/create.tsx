import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { dump } from 'js-yaml';
import { NetworkPolicyForm } from './_form';

export const NetworkPoliciesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      if (!payload.spec?.policyTypes || payload.spec.policyTypes.length === 0) {
        setError("At least one policy type (Ingress or Egress) must be selected.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.NetworkPolicies,
          action: ResourceAction.Details,
          name: payload.metadata?.name,
          namespace: payload.metadata?.namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create network policy.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.NetworkPolicies,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <NetworkPolicyBadge />Create a New Network Policy
      </CreateHeader>

      <NetworkPolicyForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};