import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { EndpointSliceBadge } from '@components/networking/endpoint-slice/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { dump } from 'js-yaml';
import { EndpointSlicesForm } from './_form';

export const EndpointSlicesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.EndpointSlices,
          action: ResourceAction.Details,
          name: payload.metadata?.name,
          namespace: payload.metadata?.namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create endpoint slice.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.EndpointSlices,
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
        <EndpointSliceBadge />Create New Endpoint Slice
      </CreateHeader>

      <EndpointSlicesForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};