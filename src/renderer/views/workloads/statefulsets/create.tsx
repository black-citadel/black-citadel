import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { StatefulSetBadge } from '@components/workloads/statefulset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { statefulSetTemplate } from '@templates/statefulset.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { Subheading } from '@components/base/heading';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';

interface EnvVar {
  name: string;
  value: string;
}

interface VolumeClaimTemplate {
  name: string;
  accessMode: string;
  storageClass: string;
  storage: string;
}

export const StatefulSetsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [replicas, setReplicas] = useState<number>(3);
  const [serviceName, setServiceName] = useState<string>('');
  const [image, setImage] = useState<string>('nginx:latest');
  const [containerName, setContainerName] = useState<string>('');
  const [containerPort, setContainerPort] = useState<string>('');
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ name: '', value: '' }]);
  const [cpuRequest, setCpuRequest] = useState<string>('');
  const [memoryRequest, setMemoryRequest] = useState<string>('');
  const [cpuLimit, setCpuLimit] = useState<string>('');
  const [memoryLimit, setMemoryLimit] = useState<string>('');
  const [volumeClaimTemplates, setVolumeClaimTemplates] = useState<VolumeClaimTemplate[]>([]);
  const [updateStrategyType, setUpdateStrategyType] = useState<'RollingUpdate' | 'OnDelete'>('RollingUpdate');
  const [partition, setPartition] = useState<string>('0');
  const [podManagementPolicy, setPodManagementPolicy] = useState<'OrderedReady' | 'Parallel'>('OrderedReady');

  const resources = {
    requests: {
      ...(cpuRequest && { cpu: cpuRequest }),
      ...(memoryRequest && { memory: memoryRequest })
    },
    limits: {
      ...(cpuLimit && { cpu: cpuLimit }),
      ...(memoryLimit && { memory: memoryLimit })
    }
  };

  const hasResources = cpuRequest || memoryRequest || cpuLimit || memoryLimit;

  const updateStrategy = {
    type: updateStrategyType,
    ...(updateStrategyType === 'RollingUpdate' && partition && {
      rollingUpdate: {
        partition: parseInt(partition)
      }
    })
  };

  const payload = statefulSetTemplate({
    name,
    namespace,
    labels,
    annotations,
    replicas,
    serviceName,
    image,
    containerName,
    containerPort: containerPort ? parseInt(containerPort) : undefined,
    envVars,
    resources: hasResources ? resources : undefined,
    volumeClaimTemplates: volumeClaimTemplates.map(vct => ({
      name: vct.name,
      accessModes: [vct.accessMode],
      storageClass: vct.storageClass || undefined,
      storage: vct.storage
    })),
    updateStrategy,
    podManagementPolicy
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.StatefulSets,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create statefulset.");
    }
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { name: '', value: '' }]);
  };

  const handleRemoveEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleEnvVarChange = (index: number, field: 'name' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const handleAddVolumeClaimTemplate = () => {
    setVolumeClaimTemplates([...volumeClaimTemplates, { 
      name: 'data', 
      accessMode: 'ReadWriteOnce', 
      storageClass: '',
      storage: '1Gi' 
    }]);
  };

  const handleRemoveVolumeClaimTemplate = (index: number) => {
    setVolumeClaimTemplates(volumeClaimTemplates.filter((_, i) => i !== index));
  };

  const handleVolumeClaimTemplateChange = (index: number, field: keyof VolumeClaimTemplate, value: string) => {
    const newTemplates = [...volumeClaimTemplates];
    newTemplates[index][field] = value;
    setVolumeClaimTemplates(newTemplates);
  };

  return (
    <>
      <CreateHeader error={error}><StatefulSetBadge />Create a New StatefulSet</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your statefulset.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-statefulset" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this statefulset.
              </Description>
              <NamespaceSelect 
                value={namespace}
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>StatefulSet Spec</Subheading>
            
            <Field>
              <Label>Replicas</Label>
              <Description>
                Number of pod replicas to run.
              </Description>
              <Input 
                type="number"
                min="0"
                name="replicas" 
                value={replicas} 
                onChange={(event) => setReplicas(parseInt(event.target.value) || 0)} 
              />
            </Field>

            <Field>
              <Label>Service Name <span className="text-red-500">*</span></Label>
              <Description>
                Name of the service that governs this StatefulSet.
              </Description>
              <Input 
                name="serviceName" 
                value={serviceName} 
                onChange={(event) => setServiceName(event.target.value)} 
                placeholder="e.g., my-service" 
              />
            </Field>

            <Field>
              <Label>Update Strategy</Label>
              <Description>
                How pods should be updated.
              </Description>
              <Dropdown 
                name="updateStrategyType" 
                value={updateStrategyType} 
                onChange={(value) => setUpdateStrategyType(value as any)}
                options={[
                  { value: 'RollingUpdate', label: 'RollingUpdate' },
                  { value: 'OnDelete', label: 'OnDelete' }
                ]}
              />
            </Field>

            {updateStrategyType === 'RollingUpdate' && (
              <Field>
                <Label>Partition</Label>
                <Description>
                  Ordinal at which the update should partition.
                </Description>
                <Input 
                  type="number"
                  min="0"
                  name="partition" 
                  value={partition} 
                  onChange={(event) => setPartition(event.target.value)} 
                />
              </Field>
            )}

            <Field>
              <Label>Pod Management Policy</Label>
              <Description>
                How pods should be created and terminated.
              </Description>
              <Dropdown 
                name="podManagementPolicy" 
                value={podManagementPolicy} 
                onChange={(value) => setPodManagementPolicy(value as any)}
                options={[
                  { value: 'OrderedReady', label: 'OrderedReady' },
                  { value: 'Parallel', label: 'Parallel' }
                ]}
              />
            </Field>
          </div>

          <div>
            <Subheading className='mb-4'>Container</Subheading>
            
            <Field>
              <Label>Container Name</Label>
              <Description>
                Name for the container (optional, defaults to statefulset name).
              </Description>
              <Input 
                name="containerName" 
                value={containerName} 
                onChange={(event) => setContainerName(event.target.value)} 
                placeholder="e.g., nginx" 
              />
            </Field>

            <Field>
              <Label>Image</Label>
              <Description>
                Docker image to use for the container.
              </Description>
              <Input 
                name="image" 
                value={image} 
                onChange={(event) => setImage(event.target.value)} 
                placeholder="e.g., nginx:latest" 
              />
            </Field>

            <Field>
              <Label>Container Port</Label>
              <Description>
                Port that the container exposes (optional).
              </Description>
              <Input 
                type="number"
                name="containerPort" 
                value={containerPort} 
                onChange={(event) => setContainerPort(event.target.value)} 
                placeholder="e.g., 80" 
              />
            </Field>
          </div>

          <div>
            <Subheading className='mb-4'>Environment Variables</Subheading>
            {envVars.map((envVar, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Name"
                  value={envVar.name}
                  onChange={(e) => handleEnvVarChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={envVar.value}
                  onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                  className="flex-1"
                />
                <Button
                  color="red"
                  onClick={() => handleRemoveEnvVar(index)}
                  disabled={envVars.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddEnvVar}>
              Add Environment Variable
            </Button>
          </div>

          <div>
            <Subheading className='mb-4'>Resources</Subheading>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Requests</p>
                <Field>
                  <Label className="sr-only">CPU Request</Label>
                  <Input 
                    name="cpuRequest" 
                    value={cpuRequest} 
                    onChange={(event) => setCpuRequest(event.target.value)} 
                    placeholder="CPU (e.g., 100m)" 
                  />
                </Field>
                <Field>
                  <Label className="sr-only">Memory Request</Label>
                  <Input 
                    name="memoryRequest" 
                    value={memoryRequest} 
                    onChange={(event) => setMemoryRequest(event.target.value)} 
                    placeholder="Memory (e.g., 128Mi)" 
                  />
                </Field>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Limits</p>
                <Field>
                  <Label className="sr-only">CPU Limit</Label>
                  <Input 
                    name="cpuLimit" 
                    value={cpuLimit} 
                    onChange={(event) => setCpuLimit(event.target.value)} 
                    placeholder="CPU (e.g., 500m)" 
                  />
                </Field>
                <Field>
                  <Label className="sr-only">Memory Limit</Label>
                  <Input 
                    name="memoryLimit" 
                    value={memoryLimit} 
                    onChange={(event) => setMemoryLimit(event.target.value)} 
                    placeholder="Memory (e.g., 512Mi)" 
                  />
                </Field>
              </div>
            </div>
          </div>

          <div>
            <Subheading className='mb-4'>Volume Claim Templates</Subheading>
            {volumeClaimTemplates.map((vct, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Name</Label>
                  <Input
                    value={vct.name}
                    onChange={(e) => handleVolumeClaimTemplateChange(index, 'name', e.target.value)}
                    placeholder="e.g., data"
                  />
                </Field>
                <Field>
                  <Label>Access Mode</Label>
                  <Dropdown
                    value={vct.accessMode}
                    onChange={(value) => handleVolumeClaimTemplateChange(index, 'accessMode', value)}
                    options={[
                      { value: 'ReadWriteOnce', label: 'ReadWriteOnce' },
                      { value: 'ReadOnlyMany', label: 'ReadOnlyMany' },
                      { value: 'ReadWriteMany', label: 'ReadWriteMany' }
                    ]}
                  />
                </Field>
                <Field>
                  <Label>Storage Class</Label>
                  <Input
                    value={vct.storageClass}
                    onChange={(e) => handleVolumeClaimTemplateChange(index, 'storageClass', e.target.value)}
                    placeholder="e.g., standard (optional)"
                  />
                </Field>
                <Field>
                  <Label>Storage</Label>
                  <Input
                    value={vct.storage}
                    onChange={(e) => handleVolumeClaimTemplateChange(index, 'storage', e.target.value)}
                    placeholder="e.g., 10Gi"
                  />
                </Field>
                <Button
                  color="red"
                  onClick={() => handleRemoveVolumeClaimTemplate(index)}
                >
                  Remove Volume Claim
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddVolumeClaimTemplate}>
              Add Volume Claim Template
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Volume claim templates create persistent volumes for each pod in the StatefulSet.
            </p>
          </div>
        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};