import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { CSIDriverBadge } from '@components/storage/csi-driver/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { csiDriverTemplate } from '@templates/csidriver.yaml';
import { dump } from 'js-yaml';
import { CSIDriverForm } from './_form';
import { V1CSIDriver } from '@utils/k8s-types';

interface TokenRequest {
  audience: string;
  expirationSeconds: string;
}

export const CSIDriversEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchCSIDriver = async () => {
      try {
        const csiDriver: V1CSIDriver = await window.electronAPI.readCSIDriver(viewContext.name);
        
        setName(csiDriver.metadata.name || '');
        
        // Set labels
        if (csiDriver.metadata.labels) {
          const labelEntries = Object.entries(csiDriver.metadata.labels).map(([key, value]) => ({ key, value }));
          setLabels(labelEntries.length > 0 ? labelEntries : [{ key: '', value: '' }]);
        }
        
        // Set annotations
        if (csiDriver.metadata.annotations) {
          const annotationEntries = Object.entries(csiDriver.metadata.annotations).map(([key, value]) => ({ key, value }));
          setAnnotations(annotationEntries.length > 0 ? annotationEntries : [{ key: '', value: '' }]);
        }
        
        // Set spec fields
        setAttachRequired(csiDriver.spec?.attachRequired || false);
        setPodInfoOnMount(csiDriver.spec?.podInfoOnMount || false);
        setStorageCapacity(csiDriver.spec?.storageCapacity || false);
        setFsGroupPolicy((csiDriver.spec?.fsGroupPolicy || '') as any);
        setRequiresRepublish(csiDriver.spec?.requiresRepublish || false);
        setVolumeLifecycleModes(csiDriver.spec?.volumeLifecycleModes || []);
        
        // Set token requests
        if (csiDriver.spec?.tokenRequests) {
          setTokenRequests(csiDriver.spec.tokenRequests.map(req => ({
            audience: req.audience || '',
            expirationSeconds: req.expirationSeconds?.toString() || ''
          })));
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch CSI driver:", e);
        setError("Failed to fetch CSI driver.");
        setLoading(false);
      }
    };

    fetchCSIDriver();
  }, [viewContext.name]);

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

  const handleUpdate = async () => {
    try {
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
      setError("Failed to update CSI driver.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.CSIDrivers,
      action: ResourceAction.Details,
      name: viewContext.name
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleUpdate()}>Update</Button>
          </div>
        }
      >
        <CSIDriverBadge />Edit CSI Driver: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};