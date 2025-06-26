import * as k8s from '@kubernetes/client-node';

export interface ServiceAccountTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  imagePullSecrets?: string[];
  secrets?: string[];
  automountServiceAccountToken?: boolean;
}

export const serviceAccountTemplate = (params: ServiceAccountTemplateParams): k8s.V1ServiceAccount => {
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

  const imagePullSecrets = params.imagePullSecrets?.filter(name => name).map(name => ({ name }));
  const secrets = params.secrets?.filter(name => name).map(name => ({ name }));

  const serviceAccount: k8s.V1ServiceAccount = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    imagePullSecrets: imagePullSecrets && imagePullSecrets.length > 0 ? imagePullSecrets : undefined,
    secrets: secrets && secrets.length > 0 ? secrets : undefined,
    automountServiceAccountToken: params.automountServiceAccountToken
  };

  return serviceAccount;
};