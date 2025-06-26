import * as k8s from '@kubernetes/client-node';

export interface IngressClassTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  controller: string;
  isDefault?: boolean;
  parameters?: {
    apiGroup?: string;
    kind: string;
    name: string;
    namespace?: string;
    scope?: 'Cluster' | 'Namespace';
  };
}

export const ingressClassTemplate = (params: IngressClassTemplateParams): k8s.V1IngressClass => {
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

  // Set default ingress class annotation if specified
  if (params.isDefault) {
    annotationsObject['ingressclass.kubernetes.io/is-default-class'] = 'true';
  }

  const ingressClass: k8s.V1IngressClass = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'IngressClass',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      controller: params.controller,
      parameters: params.parameters
    }
  };

  return ingressClass;
};