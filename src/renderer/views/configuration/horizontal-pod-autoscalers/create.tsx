import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
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
import { horizontalPodAutoscalerTemplate } from '@templates/horizontalpodautoscaler.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface ResourceMetric {
  name: 'cpu' | 'memory';
  targetType: 'Utilization' | 'Value' | 'AverageValue';
  targetUtilization: string;
  targetValue: string;
  targetAverageValue: string;
}

export const HorizontalPodAutoscalersCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [targetApiVersion, setTargetApiVersion] = useState<string>('apps/v1');
  const [targetKind, setTargetKind] = useState<string>('Deployment');
  const [targetName, setTargetName] = useState<string>('');
  const [minReplicas, setMinReplicas] = useState<string>('1');
  const [maxReplicas, setMaxReplicas] = useState<string>('10');
  const [resourceMetrics, setResourceMetrics] = useState<ResourceMetric[]>([{
    name: 'cpu',
    targetType: 'Utilization',
    targetUtilization: '80',
    targetValue: '',
    targetAverageValue: ''
  }]);
  const [scaleDownStabilization, setScaleDownStabilization] = useState<string>('300');
  const [scaleUpStabilization, setScaleUpStabilization] = useState<string>('0');

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

  const parseMetrics = () => {
    return resourceMetrics.map(metric => ({
      type: 'Resource' as const,
      resource: {
        name: metric.name,
        target: {
          type: metric.targetType,
          ...(metric.targetType === 'Utilization' && metric.targetUtilization && {
            averageUtilization: parseInt(metric.targetUtilization)
          }),
          ...(metric.targetType === 'Value' && metric.targetValue && {
            value: metric.targetValue
          }),
          ...(metric.targetType === 'AverageValue' && metric.targetAverageValue && {
            averageValue: metric.targetAverageValue
          })
        }
      }
    }));
  };

  let payload = horizontalPodAutoscalerTemplate({
    name,
    namespace,
    labels,
    annotations,
    scaleTargetRef: {
      apiVersion: targetApiVersion,
      kind: targetKind,
      name: targetName
    },
    minReplicas: minReplicas ? parseInt(minReplicas) : undefined,
    maxReplicas: parseInt(maxReplicas) || 10,
    metrics: parseMetrics(),
    behavior: {
      scaleDown: scaleDownStabilization ? {
        stabilizationWindowSeconds: parseInt(scaleDownStabilization)
      } : undefined,
      scaleUp: scaleUpStabilization ? {
        stabilizationWindowSeconds: parseInt(scaleUpStabilization)
      } : undefined
    }
  });

  const handleCreate = async () => {
    try {
      if (!targetName) {
        setError("Target resource name is required.");
        return;
      }

      if (resourceMetrics.length === 0) {
        setError("At least one metric must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.HorizontalPodAutoscalers,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create horizontal pod autoscaler.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><HorizontalPodAutoscalerBadge />Create a New Horizontal Pod Autoscaler</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
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
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this HPA.
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