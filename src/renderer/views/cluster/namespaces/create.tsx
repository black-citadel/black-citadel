import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { NamespaceForm } from './_form';


export const NamespacesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleCreate = async () => {
    if (!payload) return;
    try {
      const result = await window.electronAPI.createNamespace(payload);

      if (result.success) {
        setViewContext({
          resource: Resources.Namespaces,
          action: ResourceAction.Details,
          name: result.data.metadata.name
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create namespace.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Namespaces,
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
        <NamespaceBadge />Create a New Namespace
      </CreateHeader>

      <NamespaceForm 
        onChange={setPayload}
        isEdit={false}
      />
    </>
  );
};
