import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { IngressClassBadge } from '@components/networking/ingress-class/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { dump } from 'js-yaml';
import { IngressClassForm } from './_form';

export const IngressClassesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      if (!payload.spec?.controller) {
        setError("Controller is required.");
        return;
      }

      if (payload.spec?.parameters && (!payload.spec.parameters.kind || !payload.spec.parameters.name)) {
        setError("Parameters kind and name are required when parameters are enabled.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.IngressClasses,
          action: ResourceAction.Details,
          name: payload.metadata?.name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create ingress class.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.IngressClasses,
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
        <IngressClassBadge />Create a New Ingress Class
      </CreateHeader>

      <IngressClassForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};