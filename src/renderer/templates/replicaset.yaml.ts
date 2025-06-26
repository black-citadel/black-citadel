import * as k8s from '@kubernetes/client-node';

export interface ReplicaSetTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  replicas: number;
  image: string;
  containerName?: string;
  containerPort?: number;
  envVars: { name: string; value: string }[];
  resources?: {
    requests?: {
      cpu?: string;
      memory?: string;
    };
    limits?: {
      cpu?: string;
      memory?: string;
    };
  };
}

export const replicaSetTemplate = (params: ReplicaSetTemplateParams): k8s.V1ReplicaSet => {
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

  const container: k8s.V1Container = {
    name: params.containerName || params.name,
    image: params.image,
    ports: params.containerPort ? [{
      containerPort: params.containerPort
    }] : undefined,
    env: params.envVars.filter(env => env.name && env.value).map(env => ({
      name: env.name,
      value: env.value
    })),
    resources: params.resources
  };

  const replicaSet: k8s.V1ReplicaSet = {
    apiVersion: 'apps/v1',
    kind: 'ReplicaSet',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      replicas: params.replicas,
      selector: {
        matchLabels: labelsObject
      },
      template: {
        metadata: {
          labels: labelsObject
        },
        spec: {
          containers: [container]
        }
      }
    }
  };

  return replicaSet;
};