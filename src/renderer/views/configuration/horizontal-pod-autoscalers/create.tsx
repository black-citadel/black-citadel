import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { horizontalPodAutoscalerTemplate } from '@templates/horizontalpodautoscaler.yaml';
import { dump } from 'js-yaml';
import { HorizontalPodAutoscalerForm } from './_form';
import { FieldLabel } from '@components/form/field-labels';
import { FieldAnnotation } from '@components/form/field-annotations';

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

  const payload = horizontalPodAutoscalerTemplate({
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

  const handleCancel = () => {
    setViewContext({
      resource: Resources.HorizontalPodAutoscalers,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        }
      >
        <HorizontalPodAutoscalerBadge />Create a New Horizontal Pod Autoscaler
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <HorizontalPodAutoscalerForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          targetApiVersion={targetApiVersion}
          setTargetApiVersion={setTargetApiVersion}
          targetKind={targetKind}
          setTargetKind={setTargetKind}
          targetName={targetName}
          setTargetName={setTargetName}
          minReplicas={minReplicas}
          setMinReplicas={setMinReplicas}
          maxReplicas={maxReplicas}
          setMaxReplicas={setMaxReplicas}
          resourceMetrics={resourceMetrics}
          setResourceMetrics={setResourceMetrics}
          scaleDownStabilization={scaleDownStabilization}
          setScaleDownStabilization={setScaleDownStabilization}
          scaleUpStabilization={scaleUpStabilization}
          setScaleUpStabilization={setScaleUpStabilization}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};