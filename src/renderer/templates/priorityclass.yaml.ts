import * as k8s from '@kubernetes/client-node';

export interface PriorityClassTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  value: number;
  globalDefault?: boolean;
  description?: string;
  preemptionPolicy?: 'PreemptLowerPriority' | 'Never';
}

export const priorityClassTemplate = (params: PriorityClassTemplateParams): k8s.V1PriorityClass => {
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

  const priorityClass: k8s.V1PriorityClass = {
    apiVersion: 'scheduling.k8s.io/v1',
    kind: 'PriorityClass',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    value: params.value,
    globalDefault: params.globalDefault,
    description: params.description,
    preemptionPolicy: params.preemptionPolicy
  };

  return priorityClass;
};