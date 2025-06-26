import * as k8s from '@kubernetes/client-node';

export interface PodDisruptionBudgetTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  selector: {
    matchLabels?: { [key: string]: string };
    matchExpressions?: {
      key: string;
      operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
      values?: string[];
    }[];
  };
  minAvailable?: string | number;
  maxUnavailable?: string | number;
}

export const podDisruptionBudgetTemplate = (params: PodDisruptionBudgetTemplateParams): k8s.V1PodDisruptionBudget => {
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

  const pdb: k8s.V1PodDisruptionBudget = {
    apiVersion: 'policy/v1',
    kind: 'PodDisruptionBudget',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      selector: params.selector,
      minAvailable: params.minAvailable,
      maxUnavailable: params.maxUnavailable
    }
  };

  return pdb;
};