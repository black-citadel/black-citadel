import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { StorageClassBadge } from '@components/storage/storage-class/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { storageClassTemplate } from '@templates/storageclass.yaml';
import { dump } from 'js-yaml';
import { StorageClassForm } from './_form';

interface Parameter {
  key: string;
  value: string;
}

interface TopologyExpression {
  key: string;
  values: string;
}

export const StorageClassesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [provisioner, setProvisioner] = useState<string>('');
  const [provisionerType, setProvisionerType] = useState<string>('custom');
  const [parameters, setParameters] = useState<Parameter[]>([{ key: '', value: '' }]);
  const [reclaimPolicy, setReclaimPolicy] = useState<'Retain' | 'Delete'>('Delete');
  const [volumeBindingMode, setVolumeBindingMode] = useState<'Immediate' | 'WaitForFirstConsumer'>('Immediate');
  const [allowVolumeExpansion, setAllowVolumeExpansion] = useState<boolean>(false);
  const [mountOptions, setMountOptions] = useState<string>('');
  const [isDefaultClass, setIsDefaultClass] = useState<boolean>(false);
  const [allowedTopologies, setAllowedTopologies] = useState<TopologyExpression[]>([]);

  const parseParameters = () => {
    return parameters.reduce((acc, param) => {
      if (param.key && param.value) {
        acc[param.key] = param.value;
      }
      return acc;
    }, {} as Record<string, string>);
  };

  const parseTopologies = () => {
    return allowedTopologies
      .filter(t => t.key && t.values)
      .map(t => ({
        matchLabelExpressions: [{
          key: t.key,
          values: t.values.split(',').map(v => v.trim()).filter(v => v)
        }]
      }));
  };

  const parseMountOptions = () => {
    return mountOptions
      .split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt);
  };

  // Update annotations based on isDefaultClass
  const updatedAnnotations = [...annotations];
  const defaultClassIndex = updatedAnnotations.findIndex(a => a.key === 'storageclass.kubernetes.io/is-default-class');
  if (defaultClassIndex >= 0) {
    updatedAnnotations[defaultClassIndex].value = isDefaultClass ? 'true' : 'false';
  } else if (isDefaultClass) {
    updatedAnnotations.push({ key: 'storageclass.kubernetes.io/is-default-class', value: 'true' });
  }

  const payload = storageClassTemplate({
    name,
    labels,
    annotations: updatedAnnotations,
    provisioner,
    parameters: parseParameters(),
    reclaimPolicy,
    volumeBindingMode,
    allowVolumeExpansion,
    mountOptions: parseMountOptions(),
    allowedTopologies: parseTopologies()
  });

  const handleCreate = async () => {
    try {
      if (!provisioner) {
        setError("Provisioner is required.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.StorageClasses,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create storage class.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.StorageClasses,
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
        <StorageClassBadge />Create a New Storage Class
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <StorageClassForm
          name={name}
          setName={setName}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          provisioner={provisioner}
          setProvisioner={setProvisioner}
          provisionerType={provisionerType}
          setProvisionerType={setProvisionerType}
          parameters={parameters}
          setParameters={setParameters}
          reclaimPolicy={reclaimPolicy}
          setReclaimPolicy={setReclaimPolicy}
          volumeBindingMode={volumeBindingMode}
          setVolumeBindingMode={setVolumeBindingMode}
          allowVolumeExpansion={allowVolumeExpansion}
          setAllowVolumeExpansion={setAllowVolumeExpansion}
          mountOptions={mountOptions}
          setMountOptions={setMountOptions}
          isDefaultClass={isDefaultClass}
          setIsDefaultClass={setIsDefaultClass}
          allowedTopologies={allowedTopologies}
          setAllowedTopologies={setAllowedTopologies}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};