import * as k8s from '@kubernetes/client-node';

export interface PersistentVolumeClaimTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  accessModes: string[];
  storageClassName?: string;
  storage: string;
  volumeMode?: 'Filesystem' | 'Block';
  dataSource?: {
    kind: string;
    name: string;
    apiGroup?: string;
  };
  selector?: {
    matchLabels?: { key: string; value: string }[];
    matchExpressions?: {
      key: string;
      operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
      values?: string[];
    }[];
  };
}

export const persistentVolumeClaimTemplate = (params: PersistentVolumeClaimTemplateParams): k8s.V1PersistentVolumeClaim => {
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

  const matchLabelsObject = params.selector?.matchLabels?.reduce((acc, label) => {
    if (label.key && label.value) {
      acc[label.key] = label.value;
    }
    return acc;
  }, {} as Record<string, string>);

  const pvc: k8s.V1PersistentVolumeClaim = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      accessModes: params.accessModes,
      storageClassName: params.storageClassName,
      volumeMode: params.volumeMode,
      resources: {
        requests: {
          storage: params.storage
        }
      },
      dataSource: params.dataSource,
      selector: params.selector && (
        (params.selector.matchLabels && params.selector.matchLabels.length > 0) ||
        (params.selector.matchExpressions && params.selector.matchExpressions.length > 0)
      ) ? {
        matchLabels: matchLabelsObject && Object.keys(matchLabelsObject).length > 0 ? matchLabelsObject : undefined,
        matchExpressions: params.selector.matchExpressions?.filter(expr => expr.key)
      } : undefined
    }
  };

  return pvc;
};