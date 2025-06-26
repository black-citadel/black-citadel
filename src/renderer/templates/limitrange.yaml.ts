import * as k8s from '@kubernetes/client-node';

export interface LimitRangeTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  limits: {
    type: 'Pod' | 'Container' | 'PersistentVolumeClaim';
    max?: { [key: string]: string };
    min?: { [key: string]: string };
    default?: { [key: string]: string };
    defaultRequest?: { [key: string]: string };
    maxLimitRequestRatio?: { [key: string]: string };
  }[];
}

export const limitRangeTemplate = (params: LimitRangeTemplateParams): k8s.V1LimitRange => {
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

  const limitRange: k8s.V1LimitRange = {
    apiVersion: 'v1',
    kind: 'LimitRange',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      limits: params.limits
    }
  };

  return limitRange;
};