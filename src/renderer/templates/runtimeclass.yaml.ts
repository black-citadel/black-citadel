import * as k8s from '@kubernetes/client-node';

export interface RuntimeClassTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  handler: string;
  overhead?: {
    podFixed?: { [key: string]: string };
  };
  scheduling?: {
    nodeSelector?: { [key: string]: string };
    tolerations?: {
      key?: string;
      operator?: 'Exists' | 'Equal';
      value?: string;
      effect?: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
      tolerationSeconds?: number;
    }[];
  };
}

export const runtimeClassTemplate = (params: RuntimeClassTemplateParams): k8s.V1RuntimeClass => {
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

  const runtimeClass: k8s.V1RuntimeClass = {
    apiVersion: 'node.k8s.io/v1',
    kind: 'RuntimeClass',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    handler: params.handler,
    overhead: params.overhead,
    scheduling: params.scheduling
  };

  return runtimeClass;
};