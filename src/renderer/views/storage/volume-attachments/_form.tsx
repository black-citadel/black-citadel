import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
import { Textarea } from '@components/base/textarea';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { useState, useEffect } from 'react';
import { V1PersistentVolumeList, V1NodeList } from '@utils/k8s-types';

interface VolumeAttachmentFormProps {
  name: string;
  setName: (value: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  attacher: string;
  setAttacher: (value: string) => void;
  nodeName: string;
  setNodeName: (value: string) => void;
  sourceType: 'persistentVolume' | 'inlineSpec';
  setSourceType: (value: 'persistentVolume' | 'inlineSpec') => void;
  persistentVolumeName: string;
  setPersistentVolumeName: (value: string) => void;
  inlineVolumeSpec: string;
  setInlineVolumeSpec: (value: string) => void;
  isEdit?: boolean;
}

export const VolumeAttachmentForm = ({
  name,
  setName,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  attacher,
  setAttacher,
  nodeName,
  setNodeName,
  sourceType,
  setSourceType,
  persistentVolumeName,
  setPersistentVolumeName,
  inlineVolumeSpec,
  setInlineVolumeSpec,
  isEdit = false
}: VolumeAttachmentFormProps): JSX.Element => {
  const [availableNodes, setAvailableNodes] = useState<string[]>([]);
  const [availablePVs, setAvailablePVs] = useState<string[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodeList: V1NodeList = await window.electronAPI.listNode();
        const nodeNames = nodeList.items.map(node => node.metadata.name).filter(Boolean);
        setAvailableNodes(nodeNames);
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
      }
    };

    const fetchPVs = async () => {
      try {
        const pvList: V1PersistentVolumeList = await window.electronAPI.listPersistentVolume();
        const pvNames = pvList.items.map(pv => pv.metadata.name).filter(Boolean);
        setAvailablePVs(pvNames);
      } catch (error) {
        console.error('Failed to fetch persistent volumes:', error);
      }
    };

    fetchNodes();
    fetchPVs();
  }, []);

  return (
    <div className='px-4'>
      <div className='pb-8'>
        <h2 className='text-base font-semibold leading-7'>Volume Attachment</h2>
        <Field>
          <Label>Name <span className="text-red-500">*</span></Label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder='my-volume-attachment'
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Attacher <span className="text-red-500">*</span></Label>
          <Input 
            value={attacher} 
            onChange={(e) => setAttacher(e.target.value)} 
            placeholder='kubernetes.io/csi/example-driver'
            disabled={isEdit}
          />
          <Description>
            The name of the volume driver that must handle this request (e.g., kubernetes.io/aws-ebs)
          </Description>
        </Field>

        <Field>
          <Label>Node Name <span className="text-red-500">*</span></Label>
          <Select value={nodeName} onChange={(e) => setNodeName(e.target.value)} disabled={isEdit}>
            <option value="">Select a node</option>
            {availableNodes.map((node) => (
              <option key={node} value={node}>{node}</option>
            ))}
          </Select>
          <Description>
            The node that the volume should be attached to
          </Description>
        </Field>

        <Field>
          <Label>Source Type <span className="text-red-500">*</span></Label>
          <Select value={sourceType} onChange={(e) => setSourceType(e.target.value as 'persistentVolume' | 'inlineSpec')}>
            <option value="persistentVolume">Persistent Volume</option>
            <option value="inlineSpec">Inline Volume Spec</option>
          </Select>
        </Field>

        {sourceType === 'persistentVolume' && (
          <Field>
            <Label>Persistent Volume Name</Label>
            <Select value={persistentVolumeName} onChange={(e) => setPersistentVolumeName(e.target.value)}>
              <option value="">Select a persistent volume</option>
              {availablePVs.map((pv) => (
                <option key={pv} value={pv}>{pv}</option>
              ))}
            </Select>
          </Field>
        )}

        {sourceType === 'inlineSpec' && (
          <Field>
            <Label>Inline Volume Spec (JSON)</Label>
            <Textarea 
              value={inlineVolumeSpec} 
              onChange={(e) => setInlineVolumeSpec(e.target.value)}
              rows={10}
              placeholder={`{
  "capacity": {
    "storage": "10Gi"
  },
  "accessModes": ["ReadWriteOnce"],
  "hostPath": {
    "path": "/data"
  }
}`}
            />
            <Description>
              Provide a valid PersistentVolume spec in JSON format
            </Description>
          </Field>
        )}
      </div>

      <div className='pb-8'>
        <h2 className='text-base font-semibold leading-7'>Metadata</h2>
        <FieldLabels labels={labels} setLabels={setLabels} />
        <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
      </div>
    </div>
  );
};