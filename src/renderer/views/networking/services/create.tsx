import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { ServiceBadge } from '@components/networking/service/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { dump } from 'js-yaml';
import { ServiceForm } from './_form';

export const ServicesCreateView = (): JSX.Element => {
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
          resource: Resources.Services,
          action: ResourceAction.Details,
          name: payload.metadata?.name,
          namespace: payload.metadata?.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create service.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Services,
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
        <ServiceBadge />Create a New Service
      </CreateHeader>

      <ServiceForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};