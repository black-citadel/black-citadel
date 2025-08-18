import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { StorageClassBadge } from '@components/storage/storage-class/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { storageClassTemplate } from '@templates/storageclass.yaml';
import { dump } from 'js-yaml';
import { StorageClassForm } from './_form';
import { V1StorageClass } from '@utils/k8s-types';
import { Label } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface Parameter {
  key: string;
  value: string;
}

interface TopologyExpression {
  key: string;
  values: string;
}

export const StorageClassesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V1StorageClass | null>(null);
  
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<Label[]>([{ key: '', value: '' }]);
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

  useEffect(() => {
    const fetchStorageClass = async () => {
      try {
        const sc = await window.electronAPI.readStorageClass(viewContext.name);
        setOriginal(sc);
        
        setName(sc.metadata.name || '');
        
        const labelEntries = Object.entries(sc.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(sc.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        // Check if it's the default storage class
        const defaultAnnotation = sc.metadata.annotations?.['storageclass.kubernetes.io/is-default-class'];
        setIsDefaultClass(defaultAnnotation === 'true');
        
        setProvisioner(sc.provisioner || '');
        
        // Check if provisioner is in the common list
        const commonProvisioners = [
          'kubernetes.io/aws-ebs',
          'kubernetes.io/gce-pd',
          'kubernetes.io/azure-disk',
          'kubernetes.io/azure-file',
          'kubernetes.io/cinder',
          'kubernetes.io/vsphere-volume',
          'kubernetes.io/no-provisioner',
          'rancher.io/local-path',
          'driver.longhorn.io',
          'csi-driver.linstor.linbit.com',
          'ebs.csi.aws.com',
          'pd.csi.storage.gke.io',
          'disk.csi.azure.com',
          'file.csi.azure.com'
        ];
        
        if (commonProvisioners.includes(sc.provisioner)) {
          setProvisionerType(sc.provisioner);
        } else {
          setProvisionerType('custom');
        }
        
        // Parse parameters
        if (sc.parameters && Object.keys(sc.parameters).length > 0) {
          const paramEntries = Object.entries(sc.parameters).map(([key, value]) => ({ key, value }));
          setParameters(paramEntries);
        }
        
        if (sc.reclaimPolicy) {
          setReclaimPolicy(sc.reclaimPolicy as 'Retain' | 'Delete');
        }
        
        if (sc.volumeBindingMode) {
          setVolumeBindingMode(sc.volumeBindingMode as 'Immediate' | 'WaitForFirstConsumer');
        }
        
        setAllowVolumeExpansion(sc.allowVolumeExpansion || false);
        
        if (sc.mountOptions && sc.mountOptions.length > 0) {
          setMountOptions(sc.mountOptions.join('\n'));
        }
        
        // Parse allowed topologies
        if (sc.allowedTopologies && sc.allowedTopologies.length > 0) {
          const topologies: TopologyExpression[] = [];
          sc.allowedTopologies.forEach((topology: any) => {
            if (topology.matchLabelExpressions) {
              topology.matchLabelExpressions.forEach((expr: any) => {
                topologies.push({
                  key: expr.key || '',
                  values: expr.values ? expr.values.join(', ') : ''
                });
              });
            }
          });
          if (topologies.length > 0) {
            setAllowedTopologies(topologies);
          }
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch storage class:", e);
        setError("Failed to fetch storage class for editing.");
        setLoading(false);
      }
    };

    fetchStorageClass();
  }, [viewContext.name]);

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

  const handleUpdate = async () => {
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
      setError("Failed to update storage class.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.StorageClasses,
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
        <StorageClassBadge />Edit Storage Class: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};