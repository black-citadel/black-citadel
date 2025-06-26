import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { RuntimeClassBadge } from '@components/administration/runtime-class/badge';
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
import { runtimeClassTemplate } from '@templates/runtimeclass.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';

interface Toleration {
  key: string;
  operator: 'Exists' | 'Equal';
  value: string;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute' | '';
  tolerationSeconds: string;
}

export const RuntimeClassesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [handler, setHandler] = useState<string>('');
  const [handlerType, setHandlerType] = useState<string>('custom');
  const [enableOverhead, setEnableOverhead] = useState<boolean>(false);
  const [overheadCpu, setOverheadCpu] = useState<string>('');
  const [overheadMemory, setOverheadMemory] = useState<string>('');
  const [enableScheduling, setEnableScheduling] = useState<boolean>(false);
  const [nodeSelectors, setNodeSelectors] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [tolerations, setTolerations] = useState<Toleration[]>([]);

  const commonHandlers = {
    'runc': 'runc (default)',
    'runsc': 'gVisor',
    'kata': 'Kata Containers',
    'kata-runtime': 'Kata Containers (alternate)',
    'kata-qemu': 'Kata Containers with QEMU',
    'kata-fc': 'Kata Containers with Firecracker',
    'nvidia': 'NVIDIA Container Runtime',
    'crun': 'crun (C-based runtime)'
  };

  const handleHandlerTypeChange = (type: string) => {
    setHandlerType(type);
    if (type !== 'custom') {
      setHandler(type);
    }
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

  const parseOverhead = () => {
    if (!enableOverhead || (!overheadCpu && !overheadMemory)) return undefined;
    
    const podFixed: { [key: string]: string } = {};
    if (overheadCpu) podFixed.cpu = overheadCpu;
    if (overheadMemory) podFixed.memory = overheadMemory;
    
    return { podFixed };
  };

  const parseScheduling = () => {
    if (!enableScheduling) return undefined;
    
    const nodeSelector = nodeSelectors.reduce((acc, sel) => {
      if (sel.key && sel.value) {
        acc[sel.key] = sel.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const parsedTolerations = tolerations
      .filter(t => t.key || t.operator === 'Exists')
      .map(t => ({
        ...(t.key && { key: t.key }),
        operator: t.operator,
        ...(t.operator === 'Equal' && t.value && { value: t.value }),
        ...(t.effect && { effect: t.effect as any }),
        ...(t.effect === 'NoExecute' && t.tolerationSeconds && { 
          tolerationSeconds: parseInt(t.tolerationSeconds) 
        })
      }));

    if (Object.keys(nodeSelector).length === 0 && parsedTolerations.length === 0) {
      return undefined;
    }

    return {
      ...(Object.keys(nodeSelector).length > 0 && { nodeSelector }),
      ...(parsedTolerations.length > 0 && { tolerations: parsedTolerations })
    };
  };

  let payload = runtimeClassTemplate({
    name,
    labels,
    annotations,
    handler,
    overhead: parseOverhead(),
    scheduling: parseScheduling()
  });

  const handleCreate = async () => {
    try {
      if (!handler) {
        setError("Handler is required.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.RuntimeClasses,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create runtime class.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><RuntimeClassBadge />Create a New Runtime Class</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your runtime class.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., gvisor" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Handler</Subheading>
            
            <Field>
              <Label>Handler Type</Label>
              <Select
                value={handlerType}
                onChange={(e) => handleHandlerTypeChange(e.target.value)}
              >
                <option value="custom">Custom</option>
                {Object.entries(commonHandlers).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>

            {handlerType === 'custom' && (
              <Field>
                <Label>Handler <span className="text-red-500">*</span></Label>
                <Description>
                  The name of the runtime handler as configured in the container runtime.
                </Description>
                <Input 
                  name="handler" 
                  value={handler} 
                  onChange={(event) => setHandler(event.target.value)} 
                  placeholder="e.g., runc" 
                />
              </Field>
            )}
          </div>

          <div>
            <Field>
              <Checkbox
                checked={enableOverhead}
                onChange={setEnableOverhead}
              >
                Configure Overhead
              </Checkbox>
              <Description className="mt-1">
                Specify resource overhead associated with running pods using this runtime.
              </Description>
            </Field>

            {enableOverhead && (
              <div className="mt-4 space-y-4">
                <Field>
                  <Label>CPU Overhead</Label>
                  <Description>
                    Fixed CPU overhead for pods using this runtime.
                  </Description>
                  <Input 
                    name="overheadCpu" 
                    value={overheadCpu} 
                    onChange={(event) => setOverheadCpu(event.target.value)} 
                    placeholder="e.g., 100m" 
                  />
                </Field>

                <Field>
                  <Label>Memory Overhead</Label>
                  <Description>
                    Fixed memory overhead for pods using this runtime.
                  </Description>
                  <Input 
                    name="overheadMemory" 
                    value={overheadMemory} 
                    onChange={(event) => setOverheadMemory(event.target.value)} 
                    placeholder="e.g., 50Mi" 
                  />
                </Field>
              </div>
            )}
          </div>

          <div>
            <Field>
              <Checkbox
                checked={enableScheduling}
                onChange={setEnableScheduling}
              >
                Configure Scheduling
              </Checkbox>
              <Description className="mt-1">
                Specify node selection and tolerations for pods using this runtime.
              </Description>
            </Field>

            {enableScheduling && (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Node Selectors</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Nodes must have these labels for pods to use this runtime.
                  </p>
                  <FieldLabels labels={nodeSelectors} setLabels={setNodeSelectors} />
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Tolerations</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Tolerations to apply to pods using this runtime.
                  </p>
                  
                  {tolerations.map((toleration, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                      <Field>
                        <Label>Key</Label>
                        <Input
                          value={toleration.key}
                          onChange={(e) => handleTolerationChange(index, 'key', e.target.value)}
                          placeholder="e.g., node.kubernetes.io/runtime"
                        />
                      </Field>
                      
                      <Field>
                        <Label>Operator</Label>
                        <Select
                          value={toleration.operator}
                          onChange={(e) => handleTolerationChange(index, 'operator', e.target.value)}
                        >
                          <option value="Equal">Equal</option>
                          <option value="Exists">Exists</option>
                        </Select>
                      </Field>

                      {toleration.operator === 'Equal' && (
                        <Field>
                          <Label>Value</Label>
                          <Input
                            value={toleration.value}
                            onChange={(e) => handleTolerationChange(index, 'value', e.target.value)}
                            placeholder="e.g., gvisor"
                          />
                        </Field>
                      )}

                      <Field>
                        <Label>Effect</Label>
                        <Select
                          value={toleration.effect}
                          onChange={(e) => handleTolerationChange(index, 'effect', e.target.value)}
                        >
                          <option value="">None</option>
                          <option value="NoSchedule">NoSchedule</option>
                          <option value="PreferNoSchedule">PreferNoSchedule</option>
                          <option value="NoExecute">NoExecute</option>
                        </Select>
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

                      <Button
                        color="red"
                        onClick={() => handleRemoveToleration(index)}
                      >
                        Remove Toleration
                      </Button>
                    </div>
                  ))}
                  
                  <Button color="dark/white" onClick={handleAddToleration}>
                    Add Toleration
                  </Button>
                </div>
              </div>
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