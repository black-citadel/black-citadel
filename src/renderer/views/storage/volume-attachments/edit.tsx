import { useState, useEffect } from 'react';
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
import { V1VolumeAttachment } from '@utils/k8s-types';

export const VolumeAttachmentsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [attacher, setAttacher] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');
  const [sourceType, setSourceType] = useState<'persistentVolume' | 'inlineSpec'>('persistentVolume');
  const [persistentVolumeName, setPersistentVolumeName] = useState<string>('');
  const [inlineVolumeSpec, setInlineVolumeSpec] = useState<string>('');

  useEffect(() => {
    const fetchVolumeAttachment = async () => {
      try {
        const va: V1VolumeAttachment = await window.electronAPI.readVolumeAttachment(viewContext.name);
        
        setName(va.metadata.name || '');
        
        // Set labels
        if (va.metadata.labels) {
          const labelEntries = Object.entries(va.metadata.labels).map(([key, value]) => ({ key, value }));
          setLabels(labelEntries.length > 0 ? labelEntries : [{ key: '', value: '' }]);
        }
        
        // Set annotations
        if (va.metadata.annotations) {
          const annotationEntries = Object.entries(va.metadata.annotations).map(([key, value]) => ({ key, value }));
          setAnnotations(annotationEntries.length > 0 ? annotationEntries : [{ key: '', value: '' }]);
        }
        
        // Set spec fields
        setAttacher(va.spec.attacher || '');
        setNodeName(va.spec.nodeName || '');
        
        // Set source
        if (va.spec.source?.persistentVolumeName) {
          setSourceType('persistentVolume');
          setPersistentVolumeName(va.spec.source.persistentVolumeName);
        } else if (va.spec.source?.inlineVolumeSpec) {
          setSourceType('inlineSpec');
          setInlineVolumeSpec(JSON.stringify(va.spec.source.inlineVolumeSpec, null, 2));
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch volume attachment:", e);
        setError("Failed to fetch volume attachment.");
        setLoading(false);
      }
    };

    fetchVolumeAttachment();
  }, [viewContext.name]);

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

  const handleUpdate = async () => {
    try {
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
      setError("Failed to update volume attachment.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.VolumeAttachments,
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
        <VolumeAttachmentBadge />Edit Volume Attachment: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};