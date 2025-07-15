import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { JobBadge } from '@components/workloads/job/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { jobTemplate } from '@templates/job.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';

interface EnvVar {
  name: string;
  value: string;
}

export const JobsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [image, setImage] = useState<string>('busybox:latest');
  const [containerName, setContainerName] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [args, setArgs] = useState<string>('');
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ name: '', value: '' }]);
  const [cpuRequest, setCpuRequest] = useState<string>('');
  const [memoryRequest, setMemoryRequest] = useState<string>('');
  const [cpuLimit, setCpuLimit] = useState<string>('');
  const [memoryLimit, setMemoryLimit] = useState<string>('');
  const [completions, setCompletions] = useState<string>('1');
  const [parallelism, setParallelism] = useState<string>('1');
  const [backoffLimit, setBackoffLimit] = useState<string>('6');
  const [activeDeadlineSeconds, setActiveDeadlineSeconds] = useState<string>('');
  const [ttlSecondsAfterFinished, setTtlSecondsAfterFinished] = useState<string>('');
  const [restartPolicy, setRestartPolicy] = useState<'Never' | 'OnFailure'>('Never');

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

  const parseCommand = (cmd: string): string[] | undefined => {
    if (!cmd.trim()) return undefined;
    // Simple command parsing - split by spaces but respect quotes
    const regex = /[^\s"']+|"[^"]*"|'[^']*'/g;
    const matches = cmd.match(regex);
    return matches?.map(match => match.replace(/^["']|["']$/g, ''));
  };

  const parseArgs = (argsStr: string): string[] | undefined => {
    if (!argsStr.trim()) return undefined;
    return parseCommand(argsStr);
  };

  const payload = jobTemplate({
    name,
    namespace,
    labels,
    annotations,
    image,
    containerName,
    command: parseCommand(command),
    args: parseArgs(args),
    envVars,
    resources: hasResources ? resources : undefined,
    completions: completions ? parseInt(completions) : undefined,
    parallelism: parallelism ? parseInt(parallelism) : undefined,
    backoffLimit: backoffLimit ? parseInt(backoffLimit) : undefined,
    activeDeadlineSeconds: activeDeadlineSeconds ? parseInt(activeDeadlineSeconds) : undefined,
    ttlSecondsAfterFinished: ttlSecondsAfterFinished ? parseInt(ttlSecondsAfterFinished) : undefined,
    restartPolicy
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Jobs,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create job.");
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

  return (
    <>
      <CreateHeader error={error}><JobBadge />Create a New Job</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your job.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-job" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this job.
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
            <Subheading className='mb-4'>Job Spec</Subheading>
            
            <Field>
              <Label>Completions</Label>
              <Description>
                Desired number of successfully finished pods.
              </Description>
              <Input 
                type="number"
                min="1"
                name="completions" 
                value={completions} 
                onChange={(event) => setCompletions(event.target.value)} 
              />
            </Field>

            <Field>
              <Label>Parallelism</Label>
              <Description>
                Maximum desired number of pods running at any time.
              </Description>
              <Input 
                type="number"
                min="1"
                name="parallelism" 
                value={parallelism} 
                onChange={(event) => setParallelism(event.target.value)} 
              />
            </Field>

            <Field>
              <Label>Backoff Limit</Label>
              <Description>
                Number of retries before marking this job failed.
              </Description>
              <Input 
                type="number"
                min="0"
                name="backoffLimit" 
                value={backoffLimit} 
                onChange={(event) => setBackoffLimit(event.target.value)} 
              />
            </Field>

            <Field>
              <Label>Active Deadline Seconds</Label>
              <Description>
                Duration in seconds before the job is terminated (optional).
              </Description>
              <Input 
                type="number"
                min="1"
                name="activeDeadlineSeconds" 
                value={activeDeadlineSeconds} 
                onChange={(event) => setActiveDeadlineSeconds(event.target.value)}
                placeholder="e.g., 300" 
              />
            </Field>

            <Field>
              <Label>TTL Seconds After Finished</Label>
              <Description>
                Time to live after job finishes before automatic cleanup (optional).
              </Description>
              <Input 
                type="number"
                min="0"
                name="ttlSecondsAfterFinished" 
                value={ttlSecondsAfterFinished} 
                onChange={(event) => setTtlSecondsAfterFinished(event.target.value)}
                placeholder="e.g., 600" 
              />
            </Field>

            <Field>
              <Label>Restart Policy</Label>
              <Description>
                Pod restart policy for failed containers.
              </Description>
              <Dropdown 
                name="restartPolicy" 
                value={restartPolicy} 
                onChange={(value) => setRestartPolicy(value as any)}
                options={[
                  { value: 'Never', label: 'Never' },
                  { value: 'OnFailure', label: 'OnFailure' }
                ]}
              />
            </Field>
          </div>

          <div>
            <Subheading className='mb-4'>Container</Subheading>
            
            <Field>
              <Label>Container Name</Label>
              <Description>
                Name for the container (optional, defaults to job name).
              </Description>
              <Input 
                name="containerName" 
                value={containerName} 
                onChange={(event) => setContainerName(event.target.value)} 
                placeholder="e.g., worker" 
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
                placeholder="e.g., busybox:latest" 
              />
            </Field>

            <Field>
              <Label>Command</Label>
              <Description>
                Entrypoint array (optional). Separate arguments with spaces, use quotes for arguments with spaces.
              </Description>
              <Input 
                name="command" 
                value={command} 
                onChange={(event) => setCommand(event.target.value)} 
                placeholder='e.g., /bin/sh -c' 
              />
            </Field>

            <Field>
              <Label>Args</Label>
              <Description>
                Arguments to the entrypoint (optional). Separate with spaces, use quotes for arguments with spaces.
              </Description>
              <Input 
                name="args" 
                value={args} 
                onChange={(event) => setArgs(event.target.value)} 
                placeholder='e.g., "echo Hello World"' 
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