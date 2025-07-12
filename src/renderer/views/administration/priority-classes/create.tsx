import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PriorityClassBadge } from '@components/administration/priority-class/badge';
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
import { priorityClassTemplate } from '@templates/priorityclass.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';

export const PriorityClassesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [value, setValue] = useState<string>('1000');
  const [globalDefault, setGlobalDefault] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [preemptionPolicy, setPreemptionPolicy] = useState<'PreemptLowerPriority' | 'Never'>('PreemptLowerPriority');

  let payload = priorityClassTemplate({
    name,
    labels,
    annotations,
    value: parseInt(value) || 0,
    globalDefault,
    description: description || undefined,
    preemptionPolicy
  });

  const handleCreate = async () => {
    try {
      if (!value || isNaN(parseInt(value))) {
        setError("Priority value must be a valid integer.");
        return;
      }

      const priorityValue = parseInt(value);
      if (priorityValue < -2147483648 || priorityValue > 1000000000) {
        setError("Priority value must be between -2147483648 and 1000000000.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.PriorityClasses,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create priority class.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><PriorityClassBadge />Create a New Priority Class</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your priority class.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., high-priority" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Priority Configuration</Subheading>
            
            <Field>
              <Label>Priority Value <span className="text-red-500">*</span></Label>
              <Description>
                Integer value for this priority class. Higher values indicate higher priority.
                Must be between -2147483648 and 1000000000.
              </Description>
              <Input 
                type="number"
                name="value" 
                value={value} 
                onChange={(event) => setValue(event.target.value)} 
                placeholder="e.g., 1000" 
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                System priorities: system-cluster-critical (2000000000), system-node-critical (2000001000)
              </p>
            </Field>

            <Field>
              <Checkbox
                checked={globalDefault}
                onChange={setGlobalDefault}
              >
                Set as global default priority class
              </Checkbox>
              <Description className="mt-1">
                Pods without a priorityClassName will use this priority class.
                Only one PriorityClass can be marked as globalDefault.
              </Description>
            </Field>

            <Field>
              <Label>Description</Label>
              <Description>
                Optional description of what this priority class is used for.
              </Description>
              <textarea
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 sm:text-sm sm:leading-6"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="This priority class should be used for..."
              />
            </Field>

            <Field>
              <Label>Preemption Policy</Label>
              <Description>
                Whether pods with this priority can preempt lower priority pods.
              </Description>
              <Dropdown
                value={preemptionPolicy}
                onChange={(value) => setPreemptionPolicy(value as 'PreemptLowerPriority' | 'Never')}
                options={[
                  { value: 'PreemptLowerPriority', label: 'PreemptLowerPriority (default)' },
                  { value: 'Never', label: 'Never' }
                ]}
              />
            </Field>
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