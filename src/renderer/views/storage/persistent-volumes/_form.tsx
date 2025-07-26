import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';

interface PersistentVolumeFormProps {
  name: string;
  setName: (value: string) => void;
  labels: FieldLabel[];
  setLabels: (value: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (value: FieldAnnotation[]) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  accessModes: string[];
  setAccessModes: (value: string[]) => void;
  storageClassName: string;
  setStorageClassName: (value: string) => void;
  volumeMode: 'Filesystem' | 'Block';
  setVolumeMode: (value: 'Filesystem' | 'Block') => void;
  reclaimPolicy: 'Retain' | 'Recycle' | 'Delete';
  setReclaimPolicy: (value: 'Retain' | 'Recycle' | 'Delete') => void;
  volumeType: string;
  setVolumeType: (value: string) => void;
  // Volume source fields
  hostPath: string;
  setHostPath: (value: string) => void;
  hostPathType: string;
  setHostPathType: (value: string) => void;
  nfsServer: string;
  setNfsServer: (value: string) => void;
  nfsPath: string;
  setNfsPath: (value: string) => void;
  nfsReadOnly: boolean;
  setNfsReadOnly: (value: boolean) => void;
  localPath: string;
  setLocalPath: (value: string) => void;
  awsVolumeID: string;
  setAwsVolumeID: (value: string) => void;
  awsFsType: string;
  setAwsFsType: (value: string) => void;
  awsPartition: string;
  setAwsPartition: (value: string) => void;
  awsReadOnly: boolean;
  setAwsReadOnly: (value: boolean) => void;
  gcePdName: string;
  setGcePdName: (value: string) => void;
  gceFsType: string;
  setGceFsType: (value: string) => void;
  gcePartition: string;
  setGcePartition: (value: string) => void;
  gceReadOnly: boolean;
  setGceReadOnly: (value: boolean) => void;
  azureDiskName: string;
  setAzureDiskName: (value: string) => void;
  azureDiskURI: string;
  setAzureDiskURI: (value: string) => void;
  azureCachingMode: 'None' | 'ReadOnly' | 'ReadWrite';
  setAzureCachingMode: (value: 'None' | 'ReadOnly' | 'ReadWrite') => void;
  azureFsType: string;
  setAzureFsType: (value: string) => void;
  azureReadOnly: boolean;
  setAzureReadOnly: (value: boolean) => void;
  // Node affinity
  nodeAffinityEnabled: boolean;
  setNodeAffinityEnabled: (value: boolean) => void;
  nodeAffinityKey: string;
  setNodeAffinityKey: (value: string) => void;
  nodeAffinityOperator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
  setNodeAffinityOperator: (value: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist') => void;
  nodeAffinityValues: string;
  setNodeAffinityValues: (value: string) => void;
  isEdit?: boolean;
}

export const PersistentVolumeForm = ({
  name,
  setName,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  capacity,
  setCapacity,
  accessModes,
  setAccessModes,
  storageClassName,
  setStorageClassName,
  volumeMode,
  setVolumeMode,
  reclaimPolicy,
  setReclaimPolicy,
  volumeType,
  setVolumeType,
  hostPath,
  setHostPath,
  hostPathType,
  setHostPathType,
  nfsServer,
  setNfsServer,
  nfsPath,
  setNfsPath,
  nfsReadOnly,
  setNfsReadOnly,
  localPath,
  setLocalPath,
  awsVolumeID,
  setAwsVolumeID,
  awsFsType,
  setAwsFsType,
  awsPartition,
  setAwsPartition,
  awsReadOnly,
  setAwsReadOnly,
  gcePdName,
  setGcePdName,
  gceFsType,
  setGceFsType,
  gcePartition,
  setGcePartition,
  gceReadOnly,
  setGceReadOnly,
  azureDiskName,
  setAzureDiskName,
  azureDiskURI,
  setAzureDiskURI,
  azureCachingMode,
  setAzureCachingMode,
  azureFsType,
  setAzureFsType,
  azureReadOnly,
  setAzureReadOnly,
  nodeAffinityEnabled,
  setNodeAffinityEnabled,
  nodeAffinityKey,
  setNodeAffinityKey,
  nodeAffinityOperator,
  setNodeAffinityOperator,
  nodeAffinityValues,
  setNodeAffinityValues,
  isEdit = false
}: PersistentVolumeFormProps): JSX.Element => {
  const handleAccessModeToggle = (mode: string) => {
    setAccessModes(
      accessModes.includes(mode) 
        ? accessModes.filter(m => m !== mode)
        : [...accessModes, mode]
    );
  };

  return (
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
            disabled={isEdit}
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
          <Dropdown
            value={volumeMode}
            onChange={(value) => setVolumeMode(value as 'Filesystem' | 'Block')}
            options={[
              { value: 'Filesystem', label: 'Filesystem' },
              { value: 'Block', label: 'Block' }
            ]}
          />
        </Field>

        <Field>
          <Label>Reclaim Policy</Label>
          <Dropdown
            value={reclaimPolicy}
            onChange={(value) => setReclaimPolicy(value as 'Retain' | 'Recycle' | 'Delete')}
            options={[
              { value: 'Retain', label: 'Retain' },
              { value: 'Recycle', label: 'Recycle' },
              { value: 'Delete', label: 'Delete' }
            ]}
          />
        </Field>
      </div>

      <div>
        <Subheading className='mb-4'>Volume Source</Subheading>
        
        <Field>
          <Label>Volume Type</Label>
          <Dropdown
            value={volumeType}
            onChange={(value) => setVolumeType(value)}
            options={[
              { value: 'hostPath', label: 'Host Path (Development Only)' },
              { value: 'nfs', label: 'NFS' },
              { value: 'local', label: 'Local' },
              { value: 'awsElasticBlockStore', label: 'AWS EBS' },
              { value: 'gcePersistentDisk', label: 'GCE Persistent Disk' },
              { value: 'azureDisk', label: 'Azure Disk' }
            ]}
          />
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
              <Dropdown
                value={hostPathType}
                onChange={(value) => setHostPathType(value)}
                options={[
                  { value: '', label: 'Default' },
                  { value: 'DirectoryOrCreate', label: 'DirectoryOrCreate' },
                  { value: 'Directory', label: 'Directory' },
                  { value: 'FileOrCreate', label: 'FileOrCreate' },
                  { value: 'File', label: 'File' },
                  { value: 'Socket', label: 'Socket' },
                  { value: 'CharDevice', label: 'CharDevice' },
                  { value: 'BlockDevice', label: 'BlockDevice' }
                ]}
              />
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
                  <Dropdown
                    value={nodeAffinityOperator}
                    onChange={(value) => setNodeAffinityOperator(value as any)}
                    options={[
                      { value: 'In', label: 'In' },
                      { value: 'NotIn', label: 'NotIn' },
                      { value: 'Exists', label: 'Exists' },
                      { value: 'DoesNotExist', label: 'DoesNotExist' }
                    ]}
                  />
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
              <Dropdown
                value={azureCachingMode}
                onChange={(value) => setAzureCachingMode(value as any)}
                options={[
                  { value: 'None', label: 'None' },
                  { value: 'ReadOnly', label: 'ReadOnly' },
                  { value: 'ReadWrite', label: 'ReadWrite' }
                ]}
              />
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
  );
};