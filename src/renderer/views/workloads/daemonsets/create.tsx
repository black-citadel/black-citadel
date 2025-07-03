import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { daemonSetTemplate } from '@templates/daemonset.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface EnvVar {
  name: string;
  value: string;
}

interface Toleration {
  key: string;
  operator: 'Exists' | 'Equal';
  value: string;
  effect: '' | 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
  tolerationSeconds: string;
}

export const DaemonSetsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [image, setImage] = useState<string>('nginx:latest');
  const [containerName, setContainerName] = useState<string>('');
  const [containerPort, setContainerPort] = useState<string>('');
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ name: '', value: '' }]);
  const [cpuRequest, setCpuRequest] = useState<string>('');
  const [memoryRequest, setMemoryRequest] = useState<string>('');
  const [cpuLimit, setCpuLimit] = useState<string>('');
  const [memoryLimit, setMemoryLimit] = useState<string>('');
  const [nodeSelector, setNodeSelector] = useState<FieldLabel[]>([]);
  const [tolerations, setTolerations] = useState<Toleration[]>([]);
  const [updateStrategyType, setUpdateStrategyType] = useState<'RollingUpdate' | 'OnDelete'>('RollingUpdate');
  const [maxUnavailable, setMaxUnavailable] = useState<string>('1');

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
    ...(updateStrategyType === 'RollingUpdate' && maxUnavailable && {
      rollingUpdate: {
        maxUnavailable: isNaN(parseInt(maxUnavailable)) ? maxUnavailable : parseInt(maxUnavailable)
      }
    })
  };

  const parsedTolerations = tolerations.map(t => ({
    key: t.key,
    operator: t.operator,
    ...(t.operator === 'Equal' && t.value && { value: t.value }),
    ...(t.effect && { effect: t.effect as any }),
    ...(t.tolerationSeconds && { tolerationSeconds: parseInt(t.tolerationSeconds) })
  }));

  let payload = daemonSetTemplate({
    name,
    namespace,
    labels,
    annotations,
    image,
    containerName,
    containerPort: containerPort ? parseInt(containerPort) : undefined,
    envVars,
    resources: hasResources ? resources : undefined,
    nodeSelector: nodeSelector.filter(ns => ns.key && ns.value),
    tolerations: parsedTolerations.filter(t => t.key),
    updateStrategy
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.DaemonSets,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create daemonset.");
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

  const handleAddToleration = () => {
    setTolerations([...tolerations, { 
      key: '', 
      operator: 'Equal', 
      value: '', 
      effect: '',
      tolerationSeconds: ''
    }]);
  };

  const handleRemoveToleration = (index: number) => {
    setTolerations(tolerations.filter((_, i) => i !== index));
  };

  const handleTolerationChange = (index: number, field: keyof Toleration, value: string) => {
    const newTolerations = [...tolerations];
    (newTolerations[index] as any)[field] = value;
    setTolerations(newTolerations);
  };

  return (
    <>
      <CreateHeader error={error}><DaemonSetBadge />Create a New DaemonSet</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your daemonset.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-daemonset" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this daemonset.
              </Description>
              <NamespaceDropdown 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>DaemonSet Spec</Subheading>
            
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
                <Label>Max Unavailable</Label>
                <Description>
                  Maximum number of pods that can be unavailable during update.
                </Description>
                <Input 
                  name="maxUnavailable" 
                  value={maxUnavailable} 
                  onChange={(event) => setMaxUnavailable(event.target.value)}
                  placeholder="e.g., 1 or 25%" 
                />
              </Field>
            )}
          </div>

          <div>
            <Subheading className='mb-4'>Container</Subheading>
            
            <Field>
              <Label>Container Name</Label>
              <Description>
                Name for the container (optional, defaults to daemonset name).
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
            <Subheading className='mb-4'>Node Selection</Subheading>
            <p className="text-sm font-medium mb-2">Node Selector</p>
            <FieldLabels labels={nodeSelector} setLabels={setNodeSelector} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              DaemonSet pods will only run on nodes matching these labels.
            </p>
          </div>

          <div>
            <Subheading className='mb-4'>Tolerations</Subheading>
            {tolerations.map((toleration, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Key</Label>
                  <Input
                    value={toleration.key}
                    onChange={(e) => handleTolerationChange(index, 'key', e.target.value)}
                    placeholder="e.g., node-role.kubernetes.io/master"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <Label>Operator</Label>
                    <Dropdown
                      value={toleration.operator}
                      onChange={(value) => handleTolerationChange(index, 'operator', value)}
                      options={[
                        { value: 'Equal', label: 'Equal' },
                        { value: 'Exists', label: 'Exists' }
                      ]}
                    />
                  </Field>
                  {toleration.operator === 'Equal' && (
                    <Field>
                      <Label>Value</Label>
                      <Input
                        value={toleration.value}
                        onChange={(e) => handleTolerationChange(index, 'value', e.target.value)}
                        placeholder="e.g., true"
                      />
                    </Field>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <Label>Effect</Label>
                    <Dropdown
                      value={toleration.effect}
                      onChange={(value) => handleTolerationChange(index, 'effect', value)}
                      options={[
                        { value: '', label: 'Any' },
                        { value: 'NoSchedule', label: 'NoSchedule' },
                        { value: 'PreferNoSchedule', label: 'PreferNoSchedule' },
                        { value: 'NoExecute', label: 'NoExecute' }
                      ]}
                    />
                  </Field>
                  {toleration.effect === 'NoExecute' && (
                    <Field>
                      <Label>Toleration Seconds</Label>
                      <Input
                        type="number"
                        value={toleration.tolerationSeconds}
                        onChange={(e) => handleTolerationChange(index, 'tolerationSeconds', e.target.value)}
                        placeholder="e.g., 300"
                      />
                    </Field>
                  )}
                </div>
                <Button
                  color="red"
                  onClick={() => handleRemoveToleration(index)}
                  className="mt-2"
                >
                  Remove Toleration
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddToleration}>
              Add Toleration
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Tolerations allow DaemonSet pods to run on nodes with taints.
            </p>
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