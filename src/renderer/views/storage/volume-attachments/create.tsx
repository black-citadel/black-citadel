import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { VolumeAttachmentBadge } from '@components/storage/volume-attachment/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { volumeAttachmentTemplate } from '@templates/volumeattachment.yaml';
import { dump } from 'js-yaml';
import { VolumeAttachmentForm } from './_form';

export const VolumeAttachmentsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [attacher, setAttacher] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');
  const [sourceType, setSourceType] = useState<'persistentVolume' | 'inlineSpec'>('persistentVolume');
  const [persistentVolumeName, setPersistentVolumeName] = useState<string>('');
  const [inlineVolumeSpec, setInlineVolumeSpec] = useState<string>('');

  const parseInlineSpec = () => {
    if (sourceType === 'inlineSpec' && inlineVolumeSpec) {
      try {
        return JSON.parse(inlineVolumeSpec);
      } catch (e) {
        console.error('Invalid JSON for inline volume spec:', e);
        return null;
      }
    }
    return null;
  };

  const payload = volumeAttachmentTemplate({
    name,
    labels,
    annotations,
    attacher,
    nodeName,
    persistentVolumeName: sourceType === 'persistentVolume' ? persistentVolumeName : undefined,
    inlineVolumeSpec: parseInlineSpec()
  });

  const handleCreate = async () => {
    try {
      if (!name) {
        setError("Name is required.");
        return;
      }
      if (!attacher) {
        setError("Attacher is required.");
        return;
      }
      if (!nodeName) {
        setError("Node name is required.");
        return;
      }
      if (sourceType === 'persistentVolume' && !persistentVolumeName) {
        setError("Persistent volume name is required.");
        return;
      }
      if (sourceType === 'inlineSpec' && !inlineVolumeSpec) {
        setError("Inline volume spec is required.");
        return;
      }
      if (sourceType === 'inlineSpec') {
        try {
          JSON.parse(inlineVolumeSpec);
        } catch (e) {
          setError("Invalid JSON for inline volume spec.");
          return;
        }
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.VolumeAttachments,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create volume attachment.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.VolumeAttachments,
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
        <VolumeAttachmentBadge />Create a New Volume Attachment
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <VolumeAttachmentForm
          name={name}
          setName={setName}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          attacher={attacher}
          setAttacher={setAttacher}
          nodeName={nodeName}
          setNodeName={setNodeName}
          sourceType={sourceType}
          setSourceType={setSourceType}
          persistentVolumeName={persistentVolumeName}
          setPersistentVolumeName={setPersistentVolumeName}
          inlineVolumeSpec={inlineVolumeSpec}
          setInlineVolumeSpec={setInlineVolumeSpec}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};