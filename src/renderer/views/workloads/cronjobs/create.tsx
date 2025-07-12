import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { cronJobTemplate } from '@templates/cronjob.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface EnvVar {
  name: string;
  value: string;
}

export const CronJobsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [schedule, setSchedule] = useState<string>('*/5 * * * *');
  const [image, setImage] = useState<string>('busybox:latest');
  const [containerName, setContainerName] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [args, setArgs] = useState<string>('');
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ name: '', value: '' }]);
  const [cpuRequest, setCpuRequest] = useState<string>('');
  const [memoryRequest, setMemoryRequest] = useState<string>('');
  const [cpuLimit, setCpuLimit] = useState<string>('');
  const [memoryLimit, setMemoryLimit] = useState<string>('');
  const [concurrencyPolicy, setConcurrencyPolicy] = useState<'Allow' | 'Forbid' | 'Replace'>('Allow');
  const [startingDeadlineSeconds, setStartingDeadlineSeconds] = useState<string>('');
  const [successfulJobsHistoryLimit, setSuccessfulJobsHistoryLimit] = useState<string>('3');
  const [failedJobsHistoryLimit, setFailedJobsHistoryLimit] = useState<string>('1');
  const [suspend, setSuspend] = useState<boolean>(false);
  const [jobBackoffLimit, setJobBackoffLimit] = useState<string>('6');
  const [jobActiveDeadlineSeconds, setJobActiveDeadlineSeconds] = useState<string>('');
  const [jobTtlSecondsAfterFinished, setJobTtlSecondsAfterFinished] = useState<string>('');
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

  let payload = cronJobTemplate({
    name,
    namespace,
    labels,
    annotations,
    schedule,
    image,
    containerName,
    command: parseCommand(command),
    args: parseArgs(args),
    envVars,
    resources: hasResources ? resources : undefined,
    concurrencyPolicy,
    startingDeadlineSeconds: startingDeadlineSeconds ? parseInt(startingDeadlineSeconds) : undefined,
    successfulJobsHistoryLimit: successfulJobsHistoryLimit ? parseInt(successfulJobsHistoryLimit) : undefined,
    failedJobsHistoryLimit: failedJobsHistoryLimit ? parseInt(failedJobsHistoryLimit) : undefined,
    suspend,
    jobBackoffLimit: jobBackoffLimit ? parseInt(jobBackoffLimit) : undefined,
    jobActiveDeadlineSeconds: jobActiveDeadlineSeconds ? parseInt(jobActiveDeadlineSeconds) : undefined,
    jobTtlSecondsAfterFinished: jobTtlSecondsAfterFinished ? parseInt(jobTtlSecondsAfterFinished) : undefined,
    restartPolicy
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.CronJobs,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create cronjob.");
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
      <CreateHeader error={error}><CronJobBadge />Create a New CronJob</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your cronjob.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-cronjob" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this cronjob.
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
            <Subheading className='mb-4'>Schedule</Subheading>
            
            <Field>
              <Label>Schedule <span className="text-red-500">*</span></Label>
              <Description>
                Cron schedule expression (minute hour day month weekday).
              </Description>
              <Input 
                name="schedule" 
                value={schedule} 
                onChange={(event) => setSchedule(event.target.value)} 
                placeholder="e.g., */5 * * * *" 
              />
            </Field>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Schedule Examples:</strong><br/>
                • <code>*/5 * * * *</code> - Every 5 minutes<br/>
                • <code>0 * * * *</code> - Every hour<br/>
                • <code>0 0 * * *</code> - Every day at midnight<br/>
                • <code>0 9 * * 1-5</code> - Every weekday at 9 AM
              </p>
            </div>
          </div>

          <div>
            <Subheading className='mb-4'>CronJob Spec</Subheading>
            
            <Field>
              <Label>Concurrency Policy</Label>
              <Description>
                How to treat concurrent executions of a Job.
              </Description>
              <Dropdown 
                name="concurrencyPolicy" 
                value={concurrencyPolicy} 
                onChange={(value) => setConcurrencyPolicy(value as any)}
                options={[
                  { value: 'Allow', label: 'Allow' },
                  { value: 'Forbid', label: 'Forbid' },
                  { value: 'Replace', label: 'Replace' }
                ]}
              />
            </Field>

            <Field>
              <Label>Starting Deadline Seconds</Label>
              <Description>
                Deadline for starting the job if it misses scheduled time (optional).
              </Description>
              <Input 
                type="number"
                min="0"
                name="startingDeadlineSeconds" 
                value={startingDeadlineSeconds} 
                onChange={(event) => setStartingDeadlineSeconds(event.target.value)}
                placeholder="e.g., 100" 
              />
            </Field>

            <Field>
              <Label>Successful Jobs History Limit</Label>
              <Description>
                Number of successful finished jobs to retain.
              </Description>
              <Input 
                type="number"
                min="0"
                name="successfulJobsHistoryLimit" 
                value={successfulJobsHistoryLimit} 
                onChange={(event) => setSuccessfulJobsHistoryLimit(event.target.value)} 
              />
            </Field>

            <Field>
              <Label>Failed Jobs History Limit</Label>
              <Description>
                Number of failed finished jobs to retain.
              </Description>
              <Input 
                type="number"
                min="0"
                name="failedJobsHistoryLimit" 
                value={failedJobsHistoryLimit} 
                onChange={(event) => setFailedJobsHistoryLimit(event.target.value)} 
              />
            </Field>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={suspend}
                  onChange={(e) => setSuspend(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Suspend</span>
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                If set, all subsequent executions are suspended.
              </p>
            </div>
          </div>

          <div>
            <Subheading className='mb-4'>Job Template Spec</Subheading>
            
            <Field>
              <Label>Job Backoff Limit</Label>
              <Description>
                Number of retries before marking job as failed.
              </Description>
              <Input 
                type="number"
                min="0"
                name="jobBackoffLimit" 
                value={jobBackoffLimit} 
                onChange={(event) => setJobBackoffLimit(event.target.value)} 
              />
            </Field>

            <Field>
              <Label>Job Active Deadline Seconds</Label>
              <Description>
                Duration in seconds before job is terminated (optional).
              </Description>
              <Input 
                type="number"
                min="1"
                name="jobActiveDeadlineSeconds" 
                value={jobActiveDeadlineSeconds} 
                onChange={(event) => setJobActiveDeadlineSeconds(event.target.value)}
                placeholder="e.g., 300" 
              />
            </Field>

            <Field>
              <Label>Job TTL Seconds After Finished</Label>
              <Description>
                Time to live after job finishes before cleanup (optional).
              </Description>
              <Input 
                type="number"
                min="0"
                name="jobTtlSecondsAfterFinished" 
                value={jobTtlSecondsAfterFinished} 
                onChange={(event) => setJobTtlSecondsAfterFinished(event.target.value)}
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
                Name for the container (optional, defaults to cronjob name).
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