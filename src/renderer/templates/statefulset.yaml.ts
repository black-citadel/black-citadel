import * as k8s from '@kubernetes/client-node';

export interface StatefulSetTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  replicas: number;
  serviceName: string;
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
  volumeClaimTemplates?: {
    name: string;
    accessModes: string[];
    storageClass?: string;
    storage: string;
  }[];
  updateStrategy?: {
    type: 'RollingUpdate' | 'OnDelete';
    rollingUpdate?: {
      partition?: number;
    };
  };
  podManagementPolicy?: 'OrderedReady' | 'Parallel';
}

export const statefulSetTemplate = (params: StatefulSetTemplateParams): k8s.V1StatefulSet => {
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

  const volumeClaimTemplates = params.volumeClaimTemplates?.map(vct => ({
    metadata: {
      name: vct.name
    },
    spec: {
      accessModes: vct.accessModes,
      storageClassName: vct.storageClass,
      resources: {
        requests: {
          storage: vct.storage
        }
      }
    }
  }));

  const statefulSet: k8s.V1StatefulSet = {
    apiVersion: 'apps/v1',
    kind: 'StatefulSet',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      replicas: params.replicas,
      serviceName: params.serviceName,
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
      },
      volumeClaimTemplates: volumeClaimTemplates && volumeClaimTemplates.length > 0 ? volumeClaimTemplates : undefined,
      updateStrategy: params.updateStrategy,
      podManagementPolicy: params.podManagementPolicy
    }
  };

  return statefulSet;
};