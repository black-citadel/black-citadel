import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';
import { Button } from '@protoku/design-system';

interface Parameter {
  key: string;
  value: string;
}

interface TopologyExpression {
  key: string;
  values: string;
}

interface StorageClassFormProps {
  name: string;
  setName: (value: string) => void;
  labels: FieldLabel[];
  setLabels: (value: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (value: FieldAnnotation[]) => void;
  provisioner: string;
  setProvisioner: (value: string) => void;
  provisionerType: string;
  setProvisionerType: (value: string) => void;
  parameters: Parameter[];
  setParameters: (value: Parameter[]) => void;
  reclaimPolicy: 'Retain' | 'Delete';
  setReclaimPolicy: (value: 'Retain' | 'Delete') => void;
  volumeBindingMode: 'Immediate' | 'WaitForFirstConsumer';
  setVolumeBindingMode: (value: 'Immediate' | 'WaitForFirstConsumer') => void;
  allowVolumeExpansion: boolean;
  setAllowVolumeExpansion: (value: boolean) => void;
  mountOptions: string;
  setMountOptions: (value: string) => void;
  isDefaultClass: boolean;
  setIsDefaultClass: (value: boolean) => void;
  allowedTopologies: TopologyExpression[];
  setAllowedTopologies: (value: TopologyExpression[]) => void;
  isEdit?: boolean;
}

export const StorageClassForm = ({
  name,
  setName,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  provisioner,
  setProvisioner,
  provisionerType,
  setProvisionerType,
  parameters,
  setParameters,
  reclaimPolicy,
  setReclaimPolicy,
  volumeBindingMode,
  setVolumeBindingMode,
  allowVolumeExpansion,
  setAllowVolumeExpansion,
  mountOptions,
  setMountOptions,
  isDefaultClass,
  setIsDefaultClass,
  allowedTopologies,
  setAllowedTopologies,
  isEdit = false
}: StorageClassFormProps): JSX.Element => {
  const commonProvisioners = {
    'kubernetes.io/aws-ebs': 'AWS EBS',
    'kubernetes.io/gce-pd': 'GCE Persistent Disk',
    'kubernetes.io/azure-disk': 'Azure Disk',
    'kubernetes.io/azure-file': 'Azure File',
    'kubernetes.io/cinder': 'OpenStack Cinder',
    'kubernetes.io/vsphere-volume': 'vSphere',
    'kubernetes.io/no-provisioner': 'Local (No Provisioner)',
    'rancher.io/local-path': 'Rancher Local Path',
    'driver.longhorn.io': 'Longhorn',
    'csi-driver.linstor.linbit.com': 'LINSTOR',
    'ebs.csi.aws.com': 'AWS EBS CSI',
    'pd.csi.storage.gke.io': 'GKE PD CSI',
    'disk.csi.azure.com': 'Azure Disk CSI',
    'file.csi.azure.com': 'Azure File CSI'
  };

  const handleProvisionerTypeChange = (type: string) => {
    setProvisionerType(type);
    if (type !== 'custom') {
      setProvisioner(type);
      // Set common parameters based on provisioner
      switch (type) {
        case 'kubernetes.io/aws-ebs':
          setParameters([
            { key: 'type', value: 'gp3' },
            { key: 'fsType', value: 'ext4' }
          ]);
          break;
        case 'kubernetes.io/gce-pd':
          setParameters([
            { key: 'type', value: 'pd-standard' },
            { key: 'fsType', value: 'ext4' }
          ]);
          break;
        case 'kubernetes.io/azure-disk':
          setParameters([
            { key: 'storageaccounttype', value: 'Standard_LRS' },
            { key: 'kind', value: 'Managed' }
          ]);
          break;
        case 'ebs.csi.aws.com':
          setParameters([
            { key: 'type', value: 'gp3' },
            { key: 'csi.storage.k8s.io/fstype', value: 'ext4' }
          ]);
          break;
        default:
          setParameters([{ key: '', value: '' }]);
      }
    }
  };

  const handleAddParameter = () => {
    setParameters([...parameters, { key: '', value: '' }]);
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleParameterChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...parameters];
    newParams[index][field] = value;
    setParameters(newParams);
  };

  const handleAddTopology = () => {
    setAllowedTopologies([...allowedTopologies, { key: '', values: '' }]);
  };

  const handleRemoveTopology = (index: number) => {
    setAllowedTopologies(allowedTopologies.filter((_, i) => i !== index));
  };

  const handleTopologyChange = (index: number, field: 'key' | 'values', value: string) => {
    const newTopologies = [...allowedTopologies];
    newTopologies[index][field] = value;
    setAllowedTopologies(newTopologies);
  };

  return (
    <div className='px-4 space-y-6'>
      <div>
        <Subheading className='mb-4'>Metadata</Subheading>
        
        <Field>
          <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
          <Description>
            Enter a unique name for your storage class.
          </Description>
          <Input 
            name="name" 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            placeholder="e.g., fast-ssd"
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Checkbox
            checked={isDefaultClass}
            onChange={setIsDefaultClass}
          >
            Set as default storage class
          </Checkbox>
        </Field>

        <FieldLabels labels={labels} setLabels={setLabels} />
        <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
      </div>

      <div>
        <Subheading className='mb-4'>Provisioner</Subheading>
        
        <Field>
          <Label>Provisioner Type</Label>
          <Dropdown
            value={provisionerType}
            onChange={(value) => handleProvisionerTypeChange(value)}
            options={[
              { value: 'custom', label: 'Custom' },
              ...Object.entries(commonProvisioners).map(([value, label]) => ({
                value,
                label
              }))
            ]}
          />
        </Field>

        {provisionerType === 'custom' && (
          <Field>
            <Label>Provisioner <span className="text-red-500">*</span></Label>
            <Description>
              The volume plugin used for provisioning PVs.
            </Description>
            <Input 
              name="provisioner" 
              value={provisioner} 
              onChange={(event) => setProvisioner(event.target.value)} 
              placeholder="e.g., kubernetes.io/aws-ebs" 
            />
          </Field>
        )}
      </div>

      <div>
        <Subheading className='mb-4'>Parameters</Subheading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Provisioner-specific parameters.
        </p>
        
        {parameters.map((param, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <Label>Key</Label>
                <Input
                  value={param.key}
                  onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
                  placeholder="e.g., type"
                />
              </Field>
              <Field>
                <Label>Value</Label>
                <Input
                  value={param.value}
                  onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                  placeholder="e.g., gp3"
                />
              </Field>
            </div>
            <Button
              color="red"
              onClick={() => handleRemoveParameter(index)}
              disabled={parameters.length === 1}
            >
              Remove Parameter
            </Button>
          </div>
        ))}
        
        <Button color="dark/white" onClick={handleAddParameter}>
          Add Parameter
        </Button>
      </div>

      <div>
        <Subheading className='mb-4'>Policies</Subheading>
        
        <Field>
          <Label>Reclaim Policy</Label>
          <Description>
            What happens to PVs when PVCs are deleted.
          </Description>
          <Dropdown
            value={reclaimPolicy}
            onChange={(value) => setReclaimPolicy(value as 'Retain' | 'Delete')}
            options={[
              { value: 'Delete', label: 'Delete' },
              { value: 'Retain', label: 'Retain' }
            ]}
          />
        </Field>

        <Field>
          <Label>Volume Binding Mode</Label>
          <Description>
            When volume binding and provisioning should occur.
          </Description>
          <Dropdown
            value={volumeBindingMode}
            onChange={(value) => setVolumeBindingMode(value as 'Immediate' | 'WaitForFirstConsumer')}
            options={[
              { value: 'Immediate', label: 'Immediate' },
              { value: 'WaitForFirstConsumer', label: 'WaitForFirstConsumer' }
            ]}
          />
        </Field>

        <Field>
          <Checkbox
            checked={allowVolumeExpansion}
            onChange={setAllowVolumeExpansion}
          >
            Allow Volume Expansion
          </Checkbox>
        </Field>
      </div>

      <div>
        <Subheading className='mb-4'>Mount Options (Optional)</Subheading>
        <Field>
          <Label>Mount Options</Label>
          <Description>
            File system mount options (one per line).
          </Description>
          <textarea
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 sm:text-sm sm:leading-6"
            rows={3}
            value={mountOptions}
            onChange={(e) => setMountOptions(e.target.value)}
            placeholder="noatime&#10;discard"
          />
        </Field>
      </div>

      <div>
        <Subheading className='mb-4'>Allowed Topologies (Optional)</Subheading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Restrict provisioning to specific zones/regions.
        </p>
        
        {allowedTopologies.map((topology, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
            <Field>
              <Label>Topology Key</Label>
              <Input
                value={topology.key}
                onChange={(e) => handleTopologyChange(index, 'key', e.target.value)}
                placeholder="e.g., topology.kubernetes.io/zone"
              />
            </Field>
            <Field>
              <Label>Values (comma-separated)</Label>
              <Input
                value={topology.values}
                onChange={(e) => handleTopologyChange(index, 'values', e.target.value)}
                placeholder="e.g., us-east-1a,us-east-1b"
              />
            </Field>
            <Button
              color="red"
              onClick={() => handleRemoveTopology(index)}
            >
              Remove Topology
            </Button>
          </div>
        ))}
        
        <Button color="dark/white" onClick={handleAddTopology}>
          Add Topology Restriction
        </Button>
      </div>
    </div>
  );
};