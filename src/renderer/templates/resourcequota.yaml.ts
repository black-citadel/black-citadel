import * as k8s from '@kubernetes/client-node';

export interface ResourceQuotaTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  hard: { resource: string; value: string }[];
  scopeSelector?: {
    matchExpressions: {
      scopeName: string;
      operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
      values?: string[];
    }[];
  };
  scopes?: string[];
}

export const resourceQuotaTemplate = (params: ResourceQuotaTemplateParams): k8s.V1ResourceQuota => {
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

  const hardObject = params.hard.reduce((acc, item) => {
    if (item.resource && item.value) {
      acc[item.resource] = item.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const resourceQuota: k8s.V1ResourceQuota = {
    apiVersion: 'v1',
    kind: 'ResourceQuota',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      hard: hardObject,
      scopeSelector: params.scopeSelector && params.scopeSelector.matchExpressions.length > 0 ? params.scopeSelector : undefined,
      scopes: params.scopes && params.scopes.length > 0 ? params.scopes : undefined
    }
  };

  return resourceQuota;
};