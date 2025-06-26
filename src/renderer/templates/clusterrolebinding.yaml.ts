import * as k8s from '@kubernetes/client-node';

export interface ClusterRoleBindingTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  roleRef: {
    apiGroup: string;
    kind: string;
    name: string;
  };
  subjects: {
    kind: 'User' | 'Group' | 'ServiceAccount';
    name: string;
    namespace?: string;
    apiGroup?: string;
  }[];
}

export const clusterRoleBindingTemplate = (params: ClusterRoleBindingTemplateParams): k8s.V1ClusterRoleBinding => {
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
    ...(subject.kind === 'ServiceAccount' && subject.namespace && { namespace: subject.namespace }),
    ...(subject.kind !== 'ServiceAccount' && { apiGroup: 'rbac.authorization.k8s.io' })
  }));

  const clusterRoleBinding: k8s.V1ClusterRoleBinding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRoleBinding',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    roleRef: params.roleRef,
    subjects
  };

  return clusterRoleBinding;
};