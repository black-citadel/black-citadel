import * as k8s from '@kubernetes/client-node';

export interface ClusterRoleTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  rules: {
    apiGroups: string[];
    resources: string[];
    verbs: string[];
    resourceNames?: string[];
    nonResourceURLs?: string[];
  }[];
  aggregationRule?: {
    clusterRoleSelectors: {
      matchLabels?: { [key: string]: string };
      matchExpressions?: {
        key: string;
        operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
        values?: string[];
      }[];
    }[];
  };
}

export const clusterRoleTemplate = (params: ClusterRoleTemplateParams): k8s.V1ClusterRole => {
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

  const rules = params.rules.map(rule => ({
    apiGroups: rule.apiGroups,
    resources: rule.resources,
    verbs: rule.verbs,
    ...(rule.resourceNames && rule.resourceNames.length > 0 && { resourceNames: rule.resourceNames }),
    ...(rule.nonResourceURLs && rule.nonResourceURLs.length > 0 && { nonResourceURLs: rule.nonResourceURLs })
  }));

  const clusterRole: k8s.V1ClusterRole = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRole',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    rules: rules.length > 0 ? rules : undefined,
    aggregationRule: params.aggregationRule
  };

  return clusterRole;
};