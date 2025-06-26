import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PersistentVolumeBadge } from '@components/storage/persistent-volume/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { persistentVolumeTemplate } from '@templates/persistentvolume.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';

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

  const handleAccessModeToggle = (mode: string) => {
    setAccessModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

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

  let payload = persistentVolumeTemplate({
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

  return (
    <>
      <CreateHeader error={error}><PersistentVolumeBadge />Create a New Persistent Volume</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your persistent volume.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., pv-data" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Volume Configuration</Subheading>
            
            <Field>
              <Label>Capacity <span className="text-red-500">*</span></Label>
              <Description>
                Storage capacity of the volume.
              </Description>
              <Input 
                name="capacity" 
                value={capacity} 
                onChange={(event) => setCapacity(event.target.value)} 
                placeholder="e.g., 10Gi" 
              />
            </Field>

            <Field>
              <Label>Access Modes <span className="text-red-500">*</span></Label>
              <Description>
                How the volume can be mounted.
              </Description>
              <div className="space-y-2">
                <Checkbox
                  checked={accessModes.includes('ReadWriteOnce')}
                  onChange={() => handleAccessModeToggle('ReadWriteOnce')}
                >
                  ReadWriteOnce (RWO) - single node read-write
                </Checkbox>
                <Checkbox
                  checked={accessModes.includes('ReadOnlyMany')}
                  onChange={() => handleAccessModeToggle('ReadOnlyMany')}
                >
                  ReadOnlyMany (ROX) - multiple nodes read-only
                </Checkbox>
                <Checkbox
                  checked={accessModes.includes('ReadWriteMany')}
                  onChange={() => handleAccessModeToggle('ReadWriteMany')}
                >
                  ReadWriteMany (RWX) - multiple nodes read-write
                </Checkbox>
                <Checkbox
                  checked={accessModes.includes('ReadWriteOncePod')}
                  onChange={() => handleAccessModeToggle('ReadWriteOncePod')}
                >
                  ReadWriteOncePod (RWOP) - single pod read-write
                </Checkbox>
              </div>
            </Field>

            <Field>
              <Label>Storage Class Name</Label>
              <Description>
                Storage class to bind with PVCs.
              </Description>
              <Input 
                name="storageClassName" 
                value={storageClassName} 
                onChange={(event) => setStorageClassName(event.target.value)} 
                placeholder="e.g., fast-ssd" 
              />
            </Field>

            <Field>
              <Label>Volume Mode</Label>
              <Select
                value={volumeMode}
                onChange={(e) => setVolumeMode(e.target.value as 'Filesystem' | 'Block')}
              >
                <option value="Filesystem">Filesystem</option>
                <option value="Block">Block</option>
              </Select>
            </Field>

            <Field>
              <Label>Reclaim Policy</Label>
              <Select
                value={reclaimPolicy}
                onChange={(e) => setReclaimPolicy(e.target.value as 'Retain' | 'Recycle' | 'Delete')}
              >
                <option value="Retain">Retain</option>
                <option value="Recycle">Recycle</option>
                <option value="Delete">Delete</option>
              </Select>
            </Field>
          </div>

          <div>
            <Subheading className='mb-4'>Volume Source</Subheading>
            
            <Field>
              <Label>Volume Type</Label>
              <Select
                value={volumeType}
                onChange={(e) => setVolumeType(e.target.value as any)}
              >
                <option value="hostPath">Host Path (Development Only)</option>
                <option value="nfs">NFS</option>
                <option value="local">Local</option>
                <option value="awsElasticBlockStore">AWS EBS</option>
                <option value="gcePersistentDisk">GCE Persistent Disk</option>
                <option value="azureDisk">Azure Disk</option>
              </Select>
            </Field>

            {volumeType === 'hostPath' && (
              <>
                <Field>
                  <Label>Path <span className="text-red-500">*</span></Label>
                  <Input
                    value={hostPath}
                    onChange={(e) => setHostPath(e.target.value)}
                    placeholder="/data/pv"
                  />
                </Field>
                <Field>
                  <Label>Type</Label>
                  <Select
                    value={hostPathType}
                    onChange={(e) => setHostPathType(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="DirectoryOrCreate">DirectoryOrCreate</option>
                    <option value="Directory">Directory</option>
                    <option value="FileOrCreate">FileOrCreate</option>
                    <option value="File">File</option>
                    <option value="Socket">Socket</option>
                    <option value="CharDevice">CharDevice</option>
                    <option value="BlockDevice">BlockDevice</option>
                  </Select>
                </Field>
              </>
            )}

            {volumeType === 'nfs' && (
              <>
                <Field>
                  <Label>Server <span className="text-red-500">*</span></Label>
                  <Input
                    value={nfsServer}
                    onChange={(e) => setNfsServer(e.target.value)}
                    placeholder="nfs-server.example.com"
                  />
                </Field>
                <Field>
                  <Label>Path <span className="text-red-500">*</span></Label>
                  <Input
                    value={nfsPath}
                    onChange={(e) => setNfsPath(e.target.value)}
                    placeholder="/exports/data"
                  />
                </Field>
                <Field>
                  <Checkbox
                    checked={nfsReadOnly}
                    onChange={(checked) => setNfsReadOnly(checked)}
                  >
                    Read Only
                  </Checkbox>
                </Field>
              </>
            )}

            {volumeType === 'local' && (
              <>
                <Field>
                  <Label>Path <span className="text-red-500">*</span></Label>
                  <Input
                    value={localPath}
                    onChange={(e) => setLocalPath(e.target.value)}
                    placeholder="/mnt/local-storage"
                  />
                </Field>
                <Field>
                  <Checkbox
                    checked={nodeAffinityEnabled}
                    onChange={setNodeAffinityEnabled}
                  >
                    Enable Node Affinity (Required for Local volumes)
                  </Checkbox>
                </Field>
                {nodeAffinityEnabled && (
                  <>
                    <Field>
                      <Label>Node Selector Key</Label>
                      <Input
                        value={nodeAffinityKey}
                        onChange={(e) => setNodeAffinityKey(e.target.value)}
                        placeholder="kubernetes.io/hostname"
                      />
                    </Field>
                    <Field>
                      <Label>Operator</Label>
                      <Select
                        value={nodeAffinityOperator}
                        onChange={(e) => setNodeAffinityOperator(e.target.value as any)}
                      >
                        <option value="In">In</option>
                        <option value="NotIn">NotIn</option>
                        <option value="Exists">Exists</option>
                        <option value="DoesNotExist">DoesNotExist</option>
                      </Select>
                    </Field>
                    {['In', 'NotIn'].includes(nodeAffinityOperator) && (
                      <Field>
                        <Label>Values (comma-separated)</Label>
                        <Input
                          value={nodeAffinityValues}
                          onChange={(e) => setNodeAffinityValues(e.target.value)}
                          placeholder="node-1,node-2"
                        />
                      </Field>
                    )}
                  </>
                )}
              </>
            )}

            {volumeType === 'awsElasticBlockStore' && (
              <>
                <Field>
                  <Label>Volume ID <span className="text-red-500">*</span></Label>
                  <Input
                    value={awsVolumeID}
                    onChange={(e) => setAwsVolumeID(e.target.value)}
                    placeholder="vol-0123456789abcdef0"
                  />
                </Field>
                <Field>
                  <Label>File System Type</Label>
                  <Input
                    value={awsFsType}
                    onChange={(e) => setAwsFsType(e.target.value)}
                    placeholder="ext4"
                  />
                </Field>
                <Field>
                  <Label>Partition</Label>
                  <Input
                    type="number"
                    value={awsPartition}
                    onChange={(e) => setAwsPartition(e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <Field>
                  <Checkbox
                    checked={awsReadOnly}
                    onChange={setAwsReadOnly}
                  >
                    Read Only
                  </Checkbox>
                </Field>
              </>
            )}

            {volumeType === 'gcePersistentDisk' && (
              <>
                <Field>
                  <Label>PD Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={gcePdName}
                    onChange={(e) => setGcePdName(e.target.value)}
                    placeholder="my-data-disk"
                  />
                </Field>
                <Field>
                  <Label>File System Type</Label>
                  <Input
                    value={gceFsType}
                    onChange={(e) => setGceFsType(e.target.value)}
                    placeholder="ext4"
                  />
                </Field>
                <Field>
                  <Label>Partition</Label>
                  <Input
                    type="number"
                    value={gcePartition}
                    onChange={(e) => setGcePartition(e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <Field>
                  <Checkbox
                    checked={gceReadOnly}
                    onChange={setGceReadOnly}
                  >
                    Read Only
                  </Checkbox>
                </Field>
              </>
            )}

            {volumeType === 'azureDisk' && (
              <>
                <Field>
                  <Label>Disk Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={azureDiskName}
                    onChange={(e) => setAzureDiskName(e.target.value)}
                    placeholder="my-data-disk"
                  />
                </Field>
                <Field>
                  <Label>Disk URI <span className="text-red-500">*</span></Label>
                  <Input
                    value={azureDiskURI}
                    onChange={(e) => setAzureDiskURI(e.target.value)}
                    placeholder="/subscriptions/{sub-id}/resourcegroups/{group}/providers/Microsoft.Compute/disks/{disk}"
                  />
                </Field>
                <Field>
                  <Label>Caching Mode</Label>
                  <Select
                    value={azureCachingMode}
                    onChange={(e) => setAzureCachingMode(e.target.value as any)}
                  >
                    <option value="None">None</option>
                    <option value="ReadOnly">ReadOnly</option>
                    <option value="ReadWrite">ReadWrite</option>
                  </Select>
                </Field>
                <Field>
                  <Label>File System Type</Label>
                  <Input
                    value={azureFsType}
                    onChange={(e) => setAzureFsType(e.target.value)}
                    placeholder="ext4"
                  />
                </Field>
                <Field>
                  <Checkbox
                    checked={azureReadOnly}
                    onChange={setAzureReadOnly}
                  >
                    Read Only
                  </Checkbox>
                </Field>
              </>
            )}
          </div>
        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button onClick={() => handleCreate()} color='white' className='uppercase'>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};