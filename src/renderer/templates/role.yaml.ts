import * as k8s from '@kubernetes/client-node';

export interface RoleTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  rules: {
    apiGroups: string[];
    resources: string[];
    verbs: string[];
    resourceNames?: string[];
  }[];
}

export const roleTemplate = (params: RoleTemplateParams): k8s.V1Role => {
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
    resourceNames: rule.resourceNames && rule.resourceNames.length > 0 ? rule.resourceNames : undefined
  }));

  const role: k8s.V1Role = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    rules: rules
  };

  return role;
};