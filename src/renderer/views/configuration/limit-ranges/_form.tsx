import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { Button } from '@protoku/design-system';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import helpObjects from '@help/index';

interface LimitItem {
  type: 'Pod' | 'Container' | 'PersistentVolumeClaim';
  max: { [key: string]: string };
  min: { [key: string]: string };
  default: { [key: string]: string };
  defaultRequest: { [key: string]: string };
  maxLimitRequestRatio: { [key: string]: string };
}

interface LimitRangeFormProps {
  name: string;
  setName: (name: string) => void;
  namespace: string;
  setNamespace: (namespace: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  limits: LimitItem[];
  setLimits: (limits: LimitItem[]) => void;
  isEdit?: boolean;
}

export const LimitRangeForm = ({
  name,
  setName,
  namespace,
  setNamespace,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  limits,
  setLimits,
  isEdit = false
}: LimitRangeFormProps): JSX.Element => {
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

  return (
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
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Namespace</Label>
          <Description>
            Select the namespace for this limit range.
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
  );
};