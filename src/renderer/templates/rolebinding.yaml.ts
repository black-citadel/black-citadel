import * as k8s from '@kubernetes/client-node';

export interface RoleBindingTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  roleRef: {
    kind: 'Role' | 'ClusterRole';
    name: string;
  };
  subjects: {
    kind: 'User' | 'Group' | 'ServiceAccount';
    name: string;
    namespace?: string;
  }[];
}

export const roleBindingTemplate = (params: RoleBindingTemplateParams): k8s.V1RoleBinding => {
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

  const subjects = params.subjects.map(subject => ({
    kind: subject.kind,
    name: subject.name,
    namespace: subject.kind === 'ServiceAccount' ? (subject.namespace || params.namespace) : undefined
  }));

  const roleBinding: k8s.V1RoleBinding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'RoleBinding',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: params.roleRef.kind,
      name: params.roleRef.name
    },
    subjects: subjects
  };

  return roleBinding;
};