import { useState, useEffect } from 'react';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { daemonSetTemplate } from '@templates/daemonset.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { V1DaemonSet } from '@utils/k8s-types';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { Button } from '@protoku/design-system';
import { useView } from '@context/viewProvider';
import { TrashIcon } from '@heroicons/react/24/outline';

interface EnvVar {
  name: string;
  value: string;
}

interface DaemonSetFormProps {
  daemonSet?: V1DaemonSet | null;
  onChange?: (payload: any) => void;
  isEdit?: boolean;
}

export const DaemonSetForm = ({ 
  daemonSet, 
  onChange,
  isEdit = false 
}: DaemonSetFormProps): JSX.Element => {
  const { activeNamespace } = useView();
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

  useEffect(() => {
    if (daemonSet) {
      setName(daemonSet.metadata?.name || '');
      setNamespace(daemonSet.metadata?.namespace || 'default');
      
      // Convert labels to array format
      if (daemonSet.metadata?.labels) {
        const labelArray = Object.entries(daemonSet.metadata.labels).map(([key, value]) => ({ key, value }));
        setLabels(labelArray.length > 0 ? labelArray : [{ key: 'app', value: '' }]);
      }
      
      // Convert annotations to array format, filtering out kubectl.kubernetes.io/last-applied-configuration
      if (daemonSet.metadata?.annotations) {
        const annotationArray = Object.entries(daemonSet.metadata.annotations)
          .filter(([key]) => key !== 'kubectl.kubernetes.io/last-applied-configuration')
          .map(([key, value]) => ({ key, value }));
        setAnnotations(annotationArray.length > 0 ? annotationArray : [{ key: '', value: '' }]);
      }

      // Get container details from the first container
      const container = daemonSet.spec?.template?.spec?.containers?.[0];
      if (container) {
        setContainerName(container.name || '');
        setImage(container.image || '');
        
        // Set container port if exists
        if (container.ports && container.ports.length > 0) {
          setContainerPort(container.ports[0].containerPort?.toString() || '');
        }
        
        // Set environment variables
        if (container.env && container.env.length > 0) {
          const envArray = container.env.map(env => ({
            name: env.name || '',
            value: env.value || ''
          }));
          setEnvVars(envArray);
        }
        
        // Set resource requests and limits
        if (container.resources) {
          setCpuRequest(container.resources.requests?.cpu || '');
          setMemoryRequest(container.resources.requests?.memory || '');
          setCpuLimit(container.resources.limits?.cpu || '');
          setMemoryLimit(container.resources.limits?.memory || '');
        }
      }
    }
  }, [daemonSet]);

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

  const payload = daemonSetTemplate({
    name,
    namespace,
    labels,
    annotations,
    image,
    containerName,
    containerPort: containerPort ? parseInt(containerPort) : undefined,
    envVars,
    resources: hasResources ? resources : undefined
  });

  // Call onChange whenever the payload changes
  useEffect(() => {
    if (onChange) {
      onChange(payload);
    }
  }, [name, namespace, labels, annotations, image, containerName, containerPort, envVars, cpuRequest, memoryRequest, cpuLimit, memoryLimit, onChange]);

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

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4 space-y-6'>
        <div>
          <Subheading className='mb-4'>Metadata</Subheading>
          
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              {isEdit 
                ? 'The daemon set name cannot be changed.' 
                : 'Enter a unique name for your daemon set.'}
            </Description>
            <Input 
              name="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder={isEdit ? undefined : "e.g., my-daemonset"}
              disabled={isEdit}
              className={isEdit ? "bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-60" : undefined}
            />
          </Field>

          <Field>
            <Label>Namespace</Label>
            <Description>
              {isEdit 
                ? 'The namespace cannot be changed.' 
                : 'Select the namespace for this daemon set.'}
            </Description>
            <NamespaceSelect 
              value={namespace} 
              onChange={setNamespace}
              disabled={isEdit}
            />
          </Field>

          <FieldLabels labels={labels} setLabels={setLabels} />
          <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
        </div>

        <div>
          <Subheading className='mb-4'>Container</Subheading>
          
          <Field>
            <Label>Container Name</Label>
            <Description>
              Name for the container (optional, defaults to daemon set name).
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
          <Field className="my-8">
            <Label>
              Environment Variables (optional)
              <HelpButton title="Environment Variables" content="Key-value pairs that will be injected as environment variables in the container." />
            </Label>
            <Description>
              Add environment variables that will be available to your container.
            </Description>
            {envVars.map((envVar, index) => (
              <div key={index} className="grid gap-x-4 gap-y-6 grid-cols-[1fr,1fr,auto] my-4 items-center">
                <div>
                  <Input
                    name={`env-name-${index}`}
                    value={envVar.name}
                    onChange={(e) => handleEnvVarChange(index, 'name', e.target.value)}
                    placeholder="e.g., PORT"
                  />
                </div>
                <div>
                  <Input
                    name={`env-value-${index}`}
                    value={envVar.value}
                    onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                    placeholder="e.g., 8080"
                  />
                </div>
                <div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveEnvVar(index)} 
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    disabled={envVars.length === 1 && envVar.name === '' && envVar.value === ''}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </Field>
          <Button onClick={handleAddEnvVar} variant="secondary">
            Add another environment variable
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
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};