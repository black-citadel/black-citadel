import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { CSIDriverBadge } from '@components/storage/csi-driver/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { csiDriverTemplate } from '@templates/csidriver.yaml';
import { dump } from 'js-yaml';
import { CSIDriverForm } from './_form';

interface TokenRequest {
  audience: string;
  expirationSeconds: string;
}

export const CSIDriversCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [attachRequired, setAttachRequired] = useState<boolean>(false);
  const [podInfoOnMount, setPodInfoOnMount] = useState<boolean>(false);
  const [storageCapacity, setStorageCapacity] = useState<boolean>(false);
  const [fsGroupPolicy, setFsGroupPolicy] = useState<'ReadWriteOnceWithFSType' | 'File' | 'None' | ''>('');
  const [requiresRepublish, setRequiresRepublish] = useState<boolean>(false);
  const [volumeLifecycleModes, setVolumeLifecycleModes] = useState<string[]>([]);
  const [tokenRequests, setTokenRequests] = useState<TokenRequest[]>([]);

  const payload = csiDriverTemplate({
    name,
    labels,
    annotations,
    attachRequired,
    podInfoOnMount,
    storageCapacity,
    fsGroupPolicy: fsGroupPolicy || undefined,
    requiresRepublish,
    volumeLifecycleModes,
    tokenRequests: tokenRequests.map(req => ({
      audience: req.audience,
      expirationSeconds: req.expirationSeconds ? parseInt(req.expirationSeconds) : undefined
    }))
  });

  const handleCreate = async () => {
    try {
      if (!name) {
        setError("Name is required.");
        return;
      }

      // Validate token requests
      for (const request of tokenRequests) {
        if (!request.audience) {
          setError("Token request audience is required.");
          return;
        }
        if (request.expirationSeconds && isNaN(parseInt(request.expirationSeconds))) {
          setError("Token request expiration seconds must be a number.");
          return;
        }
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.CSIDrivers,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create CSI driver.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.CSIDrivers,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        }
      >
        <CSIDriverBadge />Create a New CSI Driver
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <CSIDriverForm
          name={name}
          setName={setName}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          attachRequired={attachRequired}
          setAttachRequired={setAttachRequired}
          podInfoOnMount={podInfoOnMount}
          setPodInfoOnMount={setPodInfoOnMount}
          storageCapacity={storageCapacity}
          setStorageCapacity={setStorageCapacity}
          fsGroupPolicy={fsGroupPolicy}
          setFsGroupPolicy={setFsGroupPolicy}
          requiresRepublish={requiresRepublish}
          setRequiresRepublish={setRequiresRepublish}
          volumeLifecycleModes={volumeLifecycleModes}
          setVolumeLifecycleModes={setVolumeLifecycleModes}
          tokenRequests={tokenRequests}
          setTokenRequests={setTokenRequests}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};