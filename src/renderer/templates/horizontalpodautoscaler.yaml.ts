import * as k8s from '@kubernetes/client-node';

export interface HorizontalPodAutoscalerTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  scaleTargetRef: {
    apiVersion: string;
    kind: string;
    name: string;
  };
  minReplicas?: number;
  maxReplicas: number;
  metrics: {
    type: 'Resource' | 'Pods' | 'Object' | 'External';
    resource?: {
      name: 'cpu' | 'memory';
      target: {
        type: 'Utilization' | 'Value' | 'AverageValue';
        averageUtilization?: number;
        value?: string;
        averageValue?: string;
      };
    };
    pods?: {
      metric: {
        name: string;
        selector?: { key: string; value: string }[];
      };
      target: {
        type: 'Value' | 'AverageValue';
        value?: string;
        averageValue?: string;
      };
    };
  }[];
  behavior?: {
    scaleDown?: {
      stabilizationWindowSeconds?: number;
      policies?: {
        type: 'Percent' | 'Pods';
        value: number;
        periodSeconds: number;
      }[];
    };
    scaleUp?: {
      stabilizationWindowSeconds?: number;
      policies?: {
        type: 'Percent' | 'Pods';
        value: number;
        periodSeconds: number;
      }[];
    };
  };
}

export const horizontalPodAutoscalerTemplate = (params: HorizontalPodAutoscalerTemplateParams): k8s.V2HorizontalPodAutoscaler => {
  const labelsObject = params.labels.reduce((acc, label) => {
    if (label.key && label.value) {
      acc[label.key] = label.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const annotationsObject = params.annotations.reduce((acc, annotation) => {
    if (annotation.key && annotation.value) {
      acc[annotation.key] = annotation.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const metrics = params.metrics.map(metric => {
    const m: any = { type: metric.type };
    
    if (metric.type === 'Resource' && metric.resource) {
      m.resource = {
        name: metric.resource.name,
        target: metric.resource.target
      };
    }
    
    if (metric.type === 'Pods' && metric.pods) {
      m.pods = {
        metric: {
          name: metric.pods.metric.name,
          selector: metric.pods.metric.selector && metric.pods.metric.selector.length > 0 ? {
            matchLabels: metric.pods.metric.selector.reduce((acc, sel) => {
              if (sel.key && sel.value) acc[sel.key] = sel.value;
              return acc;
            }, {} as Record<string, string>)
          } : undefined
        },
        target: metric.pods.target
      };
    }
    
    return m;
  });

  const hpa: k8s.V2HorizontalPodAutoscaler = {
    apiVersion: 'autoscaling/v2',
    kind: 'HorizontalPodAutoscaler',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      scaleTargetRef: params.scaleTargetRef,
      minReplicas: params.minReplicas,
      maxReplicas: params.maxReplicas,
      metrics,
      behavior: params.behavior
    }
  };

  return hpa;
};