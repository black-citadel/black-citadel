import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
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
import { limitRangeTemplate } from '@templates/limitrange.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface LimitItem {
  type: 'Pod' | 'Container' | 'PersistentVolumeClaim';
  max: { [key: string]: string };
  min: { [key: string]: string };
  default: { [key: string]: string };
  defaultRequest: { [key: string]: string };
  maxLimitRequestRatio: { [key: string]: string };
}

export const LimitRangesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [limits, setLimits] = useState<LimitItem[]>([{
    type: 'Container',
    max: { cpu: '1', memory: '1Gi' },
    min: { cpu: '100m', memory: '128Mi' },
    default: { cpu: '500m', memory: '512Mi' },
    defaultRequest: { cpu: '200m', memory: '256Mi' },
    maxLimitRequestRatio: {}
  }]);

  const handleAddLimit = () => {
    setLimits([...limits, {
      type: 'Container',
      max: {},
      min: {},
      default: {},
      defaultRequest: {},
      maxLimitRequestRatio: {}
    }]);
  };

  const handleRemoveLimit = (index: number) => {
    setLimits(limits.filter((_, i) => i !== index));
  };

  const handleLimitChange = (index: number, field: keyof LimitItem, value: any) => {
    const newLimits = [...limits];
    (newLimits[index] as any)[field] = value;
    setLimits(newLimits);
  };

  const handleResourceChange = (index: number, field: 'max' | 'min' | 'default' | 'defaultRequest' | 'maxLimitRequestRatio', resource: string, value: string) => {
    const newLimits = [...limits];
    if (value) {
      newLimits[index][field][resource] = value;
    } else {
      delete newLimits[index][field][resource];
    }
    setLimits(newLimits);
  };

  const cleanLimits = () => {
    return limits.map(limit => ({
      type: limit.type,
      max: Object.keys(limit.max).length > 0 ? limit.max : undefined,
      min: Object.keys(limit.min).length > 0 ? limit.min : undefined,
      default: Object.keys(limit.default).length > 0 ? limit.default : undefined,
      defaultRequest: Object.keys(limit.defaultRequest).length > 0 ? limit.defaultRequest : undefined,
      maxLimitRequestRatio: Object.keys(limit.maxLimitRequestRatio).length > 0 ? limit.maxLimitRequestRatio : undefined
    }));
  };

  let payload = limitRangeTemplate({
    name,
    namespace,
    labels,
    annotations,
    limits: cleanLimits()
  });

  const handleCreate = async () => {
    try {
      if (limits.length === 0) {
        setError("At least one limit must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.LimitRanges,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create limit range.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><LimitRangeBadge />Create a New Limit Range</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your limit range.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., mem-limit-range" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this limit range.
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
            <Subheading className='mb-4'>Limits</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define resource limits for different object types in this namespace.
            </p>
            
            {limits.map((limit, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Type</Label>
                  <Dropdown
                    value={limit.type}
                    onChange={(value) => handleLimitChange(index, 'type', value)}
                    options={[
                      { value: 'Pod', label: 'Pod' },
                      { value: 'Container', label: 'Container' },
                      { value: 'PersistentVolumeClaim', label: 'PersistentVolumeClaim' }
                    ]}
                  />
                </Field>

                {limit.type !== 'PersistentVolumeClaim' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Field>
                        <Label>Max CPU</Label>
                        <Input
                          value={limit.max.cpu || ''}
                          onChange={(e) => handleResourceChange(index, 'max', 'cpu', e.target.value)}
                          placeholder="e.g., 2"
                        />
                      </Field>
                      <Field>
                        <Label>Max Memory</Label>
                        <Input
                          value={limit.max.memory || ''}
                          onChange={(e) => handleResourceChange(index, 'max', 'memory', e.target.value)}
                          placeholder="e.g., 2Gi"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Field>
                        <Label>Min CPU</Label>
                        <Input
                          value={limit.min.cpu || ''}
                          onChange={(e) => handleResourceChange(index, 'min', 'cpu', e.target.value)}
                          placeholder="e.g., 100m"
                        />
                      </Field>
                      <Field>
                        <Label>Min Memory</Label>
                        <Input
                          value={limit.min.memory || ''}
                          onChange={(e) => handleResourceChange(index, 'min', 'memory', e.target.value)}
                          placeholder="e.g., 128Mi"
                        />
                      </Field>
                    </div>

                    {limit.type === 'Container' && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Default CPU</Label>
                            <Input
                              value={limit.default.cpu || ''}
                              onChange={(e) => handleResourceChange(index, 'default', 'cpu', e.target.value)}
                              placeholder="e.g., 500m"
                            />
                          </Field>
                          <Field>
                            <Label>Default Memory</Label>
                            <Input
                              value={limit.default.memory || ''}
                              onChange={(e) => handleResourceChange(index, 'default', 'memory', e.target.value)}
                              placeholder="e.g., 512Mi"
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Default Request CPU</Label>
                            <Input
                              value={limit.defaultRequest.cpu || ''}
                              onChange={(e) => handleResourceChange(index, 'defaultRequest', 'cpu', e.target.value)}
                              placeholder="e.g., 200m"
                            />
                          </Field>
                          <Field>
                            <Label>Default Request Memory</Label>
                            <Input
                              value={limit.defaultRequest.memory || ''}
                              onChange={(e) => handleResourceChange(index, 'defaultRequest', 'memory', e.target.value)}
                              placeholder="e.g., 256Mi"
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <Label>Max Limit/Request Ratio CPU</Label>
                            <Input
                              value={limit.maxLimitRequestRatio.cpu || ''}
                              onChange={(e) => handleResourceChange(index, 'maxLimitRequestRatio', 'cpu', e.target.value)}
                              placeholder="e.g., 2"
                            />
                          </Field>
                          <Field>
                            <Label>Max Limit/Request Ratio Memory</Label>
                            <Input
                              value={limit.maxLimitRequestRatio.memory || ''}
                              onChange={(e) => handleResourceChange(index, 'maxLimitRequestRatio', 'memory', e.target.value)}
                              placeholder="e.g., 2"
                            />
                          </Field>
                        </div>
                      </>
                    )}
                  </>
                )}

                {limit.type === 'PersistentVolumeClaim' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Field>
                      <Label>Max Storage</Label>
                      <Input
                        value={limit.max.storage || ''}
                        onChange={(e) => handleResourceChange(index, 'max', 'storage', e.target.value)}
                        placeholder="e.g., 10Gi"
                      />
                    </Field>
                    <Field>
                      <Label>Min Storage</Label>
                      <Input
                        value={limit.min.storage || ''}
                        onChange={(e) => handleResourceChange(index, 'min', 'storage', e.target.value)}
                        placeholder="e.g., 1Gi"
                      />
                    </Field>
                  </div>
                )}

                <Button
                  color="red"
                  onClick={() => handleRemoveLimit(index)}
                  disabled={limits.length === 1}
                >
                  Remove Limit
                </Button>
              </div>
            ))}
            
            <Button color="dark/white" onClick={handleAddLimit}>
              Add Limit
            </Button>
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