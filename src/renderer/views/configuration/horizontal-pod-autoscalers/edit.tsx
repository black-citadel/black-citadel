import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { horizontalPodAutoscalerTemplate } from '@templates/horizontalpodautoscaler.yaml';
import { dump } from 'js-yaml';
import { HorizontalPodAutoscalerForm } from './_form';
import { V2HorizontalPodAutoscaler } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface ResourceMetric {
  name: 'cpu' | 'memory';
  targetType: 'Utilization' | 'Value' | 'AverageValue';
  targetUtilization: string;
  targetValue: string;
  targetAverageValue: string;
}

export const HorizontalPodAutoscalersEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V2HorizontalPodAutoscaler | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
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

  useEffect(() => {
    const fetchHPA = async () => {
      try {
        const hpa = await window.electronAPI.readNamespacedHorizontalPodAutoscaler(viewContext.name, viewContext.namespace);
        setOriginal(hpa);
        
        setName(hpa.metadata.name || '');
        setNamespace(hpa.metadata.namespace || '');
        
        const labelEntries = Object.entries(hpa.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(hpa.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        if (hpa.spec?.scaleTargetRef) {
          setTargetApiVersion(hpa.spec.scaleTargetRef.apiVersion || 'apps/v1');
          setTargetKind(hpa.spec.scaleTargetRef.kind || 'Deployment');
          setTargetName(hpa.spec.scaleTargetRef.name || '');
        }
        
        setMinReplicas(hpa.spec?.minReplicas?.toString() || '1');
        setMaxReplicas(hpa.spec?.maxReplicas?.toString() || '10');
        
        if (hpa.spec?.metrics) {
          const parsedMetrics: ResourceMetric[] = [];
          hpa.spec.metrics.forEach((metric: any) => {
            if (metric.type === 'Resource' && metric.resource) {
              const resourceMetric: ResourceMetric = {
                name: metric.resource.name as 'cpu' | 'memory',
                targetType: 'Utilization',
                targetUtilization: '',
                targetValue: '',
                targetAverageValue: ''
              };
              
              if (metric.resource.target) {
                resourceMetric.targetType = metric.resource.target.type as 'Utilization' | 'Value' | 'AverageValue';
                if (metric.resource.target.averageUtilization) {
                  resourceMetric.targetUtilization = metric.resource.target.averageUtilization.toString();
                }
                if (metric.resource.target.value) {
                  resourceMetric.targetValue = metric.resource.target.value;
                }
                if (metric.resource.target.averageValue) {
                  resourceMetric.targetAverageValue = metric.resource.target.averageValue;
                }
              }
              
              parsedMetrics.push(resourceMetric);
            }
          });
          
          if (parsedMetrics.length > 0) {
            setResourceMetrics(parsedMetrics);
          }
        }
        
        if (hpa.spec?.behavior) {
          if (hpa.spec.behavior.scaleDown?.stabilizationWindowSeconds) {
            setScaleDownStabilization(hpa.spec.behavior.scaleDown.stabilizationWindowSeconds.toString());
          }
          if (hpa.spec.behavior.scaleUp?.stabilizationWindowSeconds) {
            setScaleUpStabilization(hpa.spec.behavior.scaleUp.stabilizationWindowSeconds.toString());
          }
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch HPA:", e);
        setError("Failed to fetch HPA for editing.");
        setLoading(false);
      }
    };

    fetchHPA();
  }, [viewContext.name, viewContext.namespace]);

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

  const handleUpdate = async () => {
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
      setError("Failed to update horizontal pod autoscaler.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.HorizontalPodAutoscalers,
      action: ResourceAction.Details,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleUpdate()}>Update</Button>
          </div>
        }
      >
        <HorizontalPodAutoscalerBadge />Edit Horizontal Pod Autoscaler: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};