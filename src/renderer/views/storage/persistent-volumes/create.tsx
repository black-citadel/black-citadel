import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PersistentVolumeBadge } from '@components/storage/persistent-volume/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { persistentVolumeTemplate } from '@templates/persistentvolume.yaml';
import { dump } from 'js-yaml';
import { PersistentVolumeForm } from './_form';

export const PersistentVolumesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [capacity, setCapacity] = useState<string>('10Gi');
  const [accessModes, setAccessModes] = useState<string[]>(['ReadWriteOnce']);
  const [storageClassName, setStorageClassName] = useState<string>('');
  const [volumeMode, setVolumeMode] = useState<'Filesystem' | 'Block'>('Filesystem');
  const [reclaimPolicy, setReclaimPolicy] = useState<'Retain' | 'Recycle' | 'Delete'>('Retain');
  const [volumeType, setVolumeType] = useState<'hostPath' | 'nfs' | 'local' | 'awsElasticBlockStore' | 'gcePersistentDisk' | 'azureDisk'>('hostPath');
  
  // Volume source fields
  const [hostPath, setHostPath] = useState<string>('/data/pv');
  const [hostPathType, setHostPathType] = useState<string>('');
  const [nfsServer, setNfsServer] = useState<string>('');
  const [nfsPath, setNfsPath] = useState<string>('');
  const [nfsReadOnly, setNfsReadOnly] = useState<boolean>(false);
  const [localPath, setLocalPath] = useState<string>('');
  const [awsVolumeID, setAwsVolumeID] = useState<string>('');
  const [awsFsType, setAwsFsType] = useState<string>('ext4');
  const [awsPartition, setAwsPartition] = useState<string>('');
  const [awsReadOnly, setAwsReadOnly] = useState<boolean>(false);
  const [gcePdName, setGcePdName] = useState<string>('');
  const [gceFsType, setGceFsType] = useState<string>('ext4');
  const [gcePartition, setGcePartition] = useState<string>('');
  const [gceReadOnly, setGceReadOnly] = useState<boolean>(false);
  const [azureDiskName, setAzureDiskName] = useState<string>('');
  const [azureDiskURI, setAzureDiskURI] = useState<string>('');
  const [azureCachingMode, setAzureCachingMode] = useState<'None' | 'ReadOnly' | 'ReadWrite'>('None');
  const [azureFsType, setAzureFsType] = useState<string>('ext4');
  const [azureReadOnly, setAzureReadOnly] = useState<boolean>(false);
  
  // Node affinity for local volumes
  const [nodeAffinityEnabled, setNodeAffinityEnabled] = useState<boolean>(false);
  const [nodeAffinityKey, setNodeAffinityKey] = useState<string>('kubernetes.io/hostname');
  const [nodeAffinityOperator, setNodeAffinityOperator] = useState<'In' | 'NotIn' | 'Exists' | 'DoesNotExist'>('In');
  const [nodeAffinityValues, setNodeAffinityValues] = useState<string>('');

  const getVolumeSource = () => {
    const source: any = { type: volumeType };
    
    switch (volumeType) {
      case 'hostPath':
        source.hostPath = {
          path: hostPath,
          ...(hostPathType && { type: hostPathType })
        };
        break;
      case 'nfs':
        source.nfs = {
          server: nfsServer,
          path: nfsPath,
          ...(nfsReadOnly && { readOnly: nfsReadOnly })
        };
        break;
      case 'local':
        source.local = { path: localPath };
        break;
      case 'awsElasticBlockStore':
        source.awsElasticBlockStore = {
          volumeID: awsVolumeID,
          ...(awsFsType && { fsType: awsFsType }),
          ...(awsPartition && { partition: parseInt(awsPartition) }),
          ...(awsReadOnly && { readOnly: awsReadOnly })
        };
        break;
      case 'gcePersistentDisk':
        source.gcePersistentDisk = {
          pdName: gcePdName,
          ...(gceFsType && { fsType: gceFsType }),
          ...(gcePartition && { partition: parseInt(gcePartition) }),
          ...(gceReadOnly && { readOnly: gceReadOnly })
        };
        break;
      case 'azureDisk':
        source.azureDisk = {
          diskName: azureDiskName,
          diskURI: azureDiskURI,
          cachingMode: azureCachingMode,
          ...(azureFsType && { fsType: azureFsType }),
          ...(azureReadOnly && { readOnly: azureReadOnly })
        };
        break;
    }
    
    return source;
  };

  const getNodeAffinity = () => {
    if (!nodeAffinityEnabled || volumeType !== 'local') return undefined;
    
    const values = nodeAffinityValues.split(',').map(v => v.trim()).filter(v => v);
    if (!nodeAffinityKey || (['In', 'NotIn'].includes(nodeAffinityOperator) && values.length === 0)) {
      return undefined;
    }
    
    return {
      required: {
        nodeSelectorTerms: [{
          matchExpressions: [{
            key: nodeAffinityKey,
            operator: nodeAffinityOperator,
            ...((['In', 'NotIn'].includes(nodeAffinityOperator) && values.length > 0) && { values })
          }]
        }]
      }
    };
  };

  const payload = persistentVolumeTemplate({
    name,
    labels,
    annotations,
    capacity,
    accessModes,
    storageClassName: storageClassName || undefined,
    volumeMode,
    persistentVolumeReclaimPolicy: reclaimPolicy,
    volumeSource: getVolumeSource(),
    nodeAffinity: getNodeAffinity()
  });

  const handleCreate = async () => {
    try {
      if (accessModes.length === 0) {
        setError("At least one access mode must be selected.");
        return;
      }

      // Validate volume source
      switch (volumeType) {
        case 'hostPath':
          if (!hostPath) {
            setError("Host path is required.");
            return;
          }
          break;
        case 'nfs':
          if (!nfsServer || !nfsPath) {
            setError("NFS server and path are required.");
            return;
          }
          break;
        case 'local':
          if (!localPath) {
            setError("Local path is required.");
            return;
          }
          if (!nodeAffinityEnabled || !nodeAffinityKey) {
            setError("Local volumes require node affinity.");
            return;
          }
          break;
        case 'awsElasticBlockStore':
          if (!awsVolumeID) {
            setError("AWS Volume ID is required.");
            return;
          }
          break;
        case 'gcePersistentDisk':
          if (!gcePdName) {
            setError("GCE PD name is required.");
            return;
          }
          break;
        case 'azureDisk':
          if (!azureDiskName || !azureDiskURI) {
            setError("Azure disk name and URI are required.");
            return;
          }
          break;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.PersistentVolumes,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create persistent volume.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.PersistentVolumes,
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
        <PersistentVolumeBadge />Create a New Persistent Volume
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <PersistentVolumeForm
          name={name}
          setName={setName}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          capacity={capacity}
          setCapacity={setCapacity}
          accessModes={accessModes}
          setAccessModes={setAccessModes}
          storageClassName={storageClassName}
          setStorageClassName={setStorageClassName}
          volumeMode={volumeMode}
          setVolumeMode={setVolumeMode}
          reclaimPolicy={reclaimPolicy}
          setReclaimPolicy={setReclaimPolicy}
          volumeType={volumeType}
          setVolumeType={(value: string) => setVolumeType(value as 'hostPath' | 'nfs' | 'local' | 'awsElasticBlockStore' | 'gcePersistentDisk' | 'azureDisk')}
          hostPath={hostPath}
          setHostPath={setHostPath}
          hostPathType={hostPathType}
          setHostPathType={setHostPathType}
          nfsServer={nfsServer}
          setNfsServer={setNfsServer}
          nfsPath={nfsPath}
          setNfsPath={setNfsPath}
          nfsReadOnly={nfsReadOnly}
          setNfsReadOnly={setNfsReadOnly}
          localPath={localPath}
          setLocalPath={setLocalPath}
          awsVolumeID={awsVolumeID}
          setAwsVolumeID={setAwsVolumeID}
          awsFsType={awsFsType}
          setAwsFsType={setAwsFsType}
          awsPartition={awsPartition}
          setAwsPartition={setAwsPartition}
          awsReadOnly={awsReadOnly}
          setAwsReadOnly={setAwsReadOnly}
          gcePdName={gcePdName}
          setGcePdName={setGcePdName}
          gceFsType={gceFsType}
          setGceFsType={setGceFsType}
          gcePartition={gcePartition}
          setGcePartition={setGcePartition}
          gceReadOnly={gceReadOnly}
          setGceReadOnly={setGceReadOnly}
          azureDiskName={azureDiskName}
          setAzureDiskName={setAzureDiskName}
          azureDiskURI={azureDiskURI}
          setAzureDiskURI={setAzureDiskURI}
          azureCachingMode={azureCachingMode}
          setAzureCachingMode={setAzureCachingMode}
          azureFsType={azureFsType}
          setAzureFsType={setAzureFsType}
          azureReadOnly={azureReadOnly}
          setAzureReadOnly={setAzureReadOnly}
          nodeAffinityEnabled={nodeAffinityEnabled}
          setNodeAffinityEnabled={setNodeAffinityEnabled}
          nodeAffinityKey={nodeAffinityKey}
          setNodeAffinityKey={setNodeAffinityKey}
          nodeAffinityOperator={nodeAffinityOperator}
          setNodeAffinityOperator={setNodeAffinityOperator}
          nodeAffinityValues={nodeAffinityValues}
          setNodeAffinityValues={setNodeAffinityValues}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};