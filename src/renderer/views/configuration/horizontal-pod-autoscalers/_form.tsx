import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { Button } from '@protoku-bv/design-system';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import helpObjects from '@help/index';

interface ResourceMetric {
  name: 'cpu' | 'memory';
  targetType: 'Utilization' | 'Value' | 'AverageValue';
  targetUtilization: string;
  targetValue: string;
  targetAverageValue: string;
}

interface HorizontalPodAutoscalerFormProps {
  name: string;
  setName: (name: string) => void;
  namespace: string;
  setNamespace: (namespace: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  targetApiVersion: string;
  setTargetApiVersion: (version: string) => void;
  targetKind: string;
  setTargetKind: (kind: string) => void;
  targetName: string;
  setTargetName: (name: string) => void;
  minReplicas: string;
  setMinReplicas: (replicas: string) => void;
  maxReplicas: string;
  setMaxReplicas: (replicas: string) => void;
  resourceMetrics: ResourceMetric[];
  setResourceMetrics: (metrics: ResourceMetric[]) => void;
  scaleDownStabilization: string;
  setScaleDownStabilization: (seconds: string) => void;
  scaleUpStabilization: string;
  setScaleUpStabilization: (seconds: string) => void;
  isEdit?: boolean;
}

export const HorizontalPodAutoscalerForm = ({
  name,
  setName,
  namespace,
  setNamespace,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  targetApiVersion,
  setTargetApiVersion,
  targetKind,
  setTargetKind,
  targetName,
  setTargetName,
  minReplicas,
  setMinReplicas,
  maxReplicas,
  setMaxReplicas,
  resourceMetrics,
  setResourceMetrics,
  scaleDownStabilization,
  setScaleDownStabilization,
  scaleUpStabilization,
  setScaleUpStabilization,
  isEdit = false
}: HorizontalPodAutoscalerFormProps): JSX.Element => {
  const handleAddResourceMetric = () => {
    setResourceMetrics([...resourceMetrics, {
      name: 'memory',
      targetType: 'Utilization',
      targetUtilization: '80',
      targetValue: '',
      targetAverageValue: ''
    }]);
  };

  const handleRemoveResourceMetric = (index: number) => {
    setResourceMetrics(resourceMetrics.filter((_, i) => i !== index));
  };

  const handleResourceMetricChange = (index: number, field: keyof ResourceMetric, value: string) => {
    const newMetrics = [...resourceMetrics];
    (newMetrics[index] as any)[field] = value;
    setResourceMetrics(newMetrics);
  };

  return (
    <div className='px-4 space-y-6'>
      <div>
        <Subheading className='mb-4'>Metadata</Subheading>
        
        <Field>
          <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
          <Description>
            Enter a unique name for your HPA.
          </Description>
          <Input 
            name="name" 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            placeholder="e.g., my-app-hpa" 
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Namespace</Label>
          <Description>
            Select the namespace for this HPA.
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
        <Subheading className='mb-4'>Scale Target</Subheading>
        
        <Field>
          <Label>Target Kind</Label>
          <Description>
            Type of resource to scale.
          </Description>
          <Dropdown 
            name="targetKind" 
            value={targetKind} 
            onChange={(value) => setTargetKind(value)}
            options={[
              { value: 'Deployment', label: 'Deployment' },
              { value: 'StatefulSet', label: 'StatefulSet' },
              { value: 'ReplicaSet', label: 'ReplicaSet' }
            ]}
          />
        </Field>

        <Field>
          <Label>Target API Version</Label>
          <Description>
            API version of the target resource.
          </Description>
          <Input 
            name="targetApiVersion" 
            value={targetApiVersion} 
            onChange={(event) => setTargetApiVersion(event.target.value)} 
            placeholder="e.g., apps/v1" 
          />
        </Field>

        <Field>
          <Label>Target Name <span className="text-red-500">*</span></Label>
          <Description>
            Name of the resource to scale.
          </Description>
          <Input 
            name="targetName" 
            value={targetName} 
            onChange={(event) => setTargetName(event.target.value)} 
            placeholder="e.g., my-deployment" 
          />
        </Field>
      </div>

      <div>
        <Subheading className='mb-4'>Scaling Configuration</Subheading>
        
        <Field>
          <Label>Min Replicas</Label>
          <Description>
            Minimum number of replicas (defaults to 1).
          </Description>
          <Input 
            type="number"
            min="1"
            name="minReplicas" 
            value={minReplicas} 
            onChange={(event) => setMinReplicas(event.target.value)} 
          />
        </Field>

        <Field>
          <Label>Max Replicas <span className="text-red-500">*</span></Label>
          <Description>
            Maximum number of replicas.
          </Description>
          <Input 
            type="number"
            min="1"
            name="maxReplicas" 
            value={maxReplicas} 
            onChange={(event) => setMaxReplicas(event.target.value)} 
          />
        </Field>
      </div>

      <div>
        <Subheading className='mb-4'>Metrics</Subheading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define the metrics that trigger scaling.
        </p>
        
        {resourceMetrics.map((metric, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
            <Field>
              <Label>Resource</Label>
              <Dropdown
                value={metric.name}
                onChange={(value) => handleResourceMetricChange(index, 'name', value)}
                options={[
                  { value: 'cpu', label: 'CPU' },
                  { value: 'memory', label: 'Memory' }
                ]}
              />
            </Field>

            <Field>
              <Label>Target Type</Label>
              <Dropdown
                value={metric.targetType}
                onChange={(value) => handleResourceMetricChange(index, 'targetType', value)}
                options={[
                  { value: 'Utilization', label: 'Utilization (%)' },
                  { value: 'Value', label: 'Value (absolute)' },
                  { value: 'AverageValue', label: 'Average Value (per pod)' }
                ]}
              />
            </Field>

            {metric.targetType === 'Utilization' && (
              <Field>
                <Label>Target Utilization (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={metric.targetUtilization}
                  onChange={(e) => handleResourceMetricChange(index, 'targetUtilization', e.target.value)}
                  placeholder="e.g., 80"
                />
              </Field>
            )}

            {metric.targetType === 'Value' && (
              <Field>
                <Label>Target Value</Label>
                <Input
                  value={metric.targetValue}
                  onChange={(e) => handleResourceMetricChange(index, 'targetValue', e.target.value)}
                  placeholder={metric.name === 'cpu' ? 'e.g., 500m' : 'e.g., 1Gi'}
                />
              </Field>
            )}

            {metric.targetType === 'AverageValue' && (
              <Field>
                <Label>Target Average Value</Label>
                <Input
                  value={metric.targetAverageValue}
                  onChange={(e) => handleResourceMetricChange(index, 'targetAverageValue', e.target.value)}
                  placeholder={metric.name === 'cpu' ? 'e.g., 100m' : 'e.g., 100Mi'}
                />
              </Field>
            )}

            <Button
              color="red"
              onClick={() => handleRemoveResourceMetric(index)}
              disabled={resourceMetrics.length === 1}
            >
              Remove Metric
            </Button>
          </div>
        ))}
        
        <Button color="dark/white" onClick={handleAddResourceMetric}>
          Add Metric
        </Button>
      </div>

      <div>
        <Subheading className='mb-4'>Behavior (Optional)</Subheading>
        
        <Field>
          <Label>Scale Down Stabilization (seconds)</Label>
          <Description>
            Time to wait before scaling down (default: 300s).
          </Description>
          <Input 
            type="number"
            min="0"
            name="scaleDownStabilization" 
            value={scaleDownStabilization} 
            onChange={(event) => setScaleDownStabilization(event.target.value)} 
          />
        </Field>

        <Field>
          <Label>Scale Up Stabilization (seconds)</Label>
          <Description>
            Time to wait before scaling up (default: 0s).
          </Description>
          <Input 
            type="number"
            min="0"
            name="scaleUpStabilization" 
            value={scaleUpStabilization} 
            onChange={(event) => setScaleUpStabilization(event.target.value)} 
          />
        </Field>
      </div>
    </div>
  );
};