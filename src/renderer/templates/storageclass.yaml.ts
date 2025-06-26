import * as k8s from '@kubernetes/client-node';

export interface StorageClassTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  provisioner: string;
  parameters?: { [key: string]: string };
  reclaimPolicy?: 'Retain' | 'Delete';
  volumeBindingMode?: 'Immediate' | 'WaitForFirstConsumer';
  allowVolumeExpansion?: boolean;
  mountOptions?: string[];
  allowedTopologies?: {
    matchLabelExpressions: {
      key: string;
      values: string[];
    }[];
  }[];
}

export const storageClassTemplate = (params: StorageClassTemplateParams): k8s.V1StorageClass => {
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

  // Set default storage class annotation if not already set
  if (!annotationsObject['storageclass.kubernetes.io/is-default-class']) {
    annotationsObject['storageclass.kubernetes.io/is-default-class'] = 'false';
  }

  const storageClass: k8s.V1StorageClass = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    provisioner: params.provisioner,
    parameters: params.parameters && Object.keys(params.parameters).length > 0 ? params.parameters : undefined,
    reclaimPolicy: params.reclaimPolicy,
    volumeBindingMode: params.volumeBindingMode,
    allowVolumeExpansion: params.allowVolumeExpansion,
    mountOptions: params.mountOptions && params.mountOptions.length > 0 ? params.mountOptions : undefined,
    allowedTopologies: params.allowedTopologies && params.allowedTopologies.length > 0 ? params.allowedTopologies : undefined
  };

  return storageClass;
};