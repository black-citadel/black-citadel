import * as k8s from '@kubernetes/client-node';

export interface PersistentVolumeTemplateParams {
  name: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  capacity: string;
  accessModes: string[];
  storageClassName?: string;
  volumeMode?: 'Filesystem' | 'Block';
  persistentVolumeReclaimPolicy?: 'Retain' | 'Recycle' | 'Delete';
  volumeSource: {
    type: 'hostPath' | 'nfs' | 'local' | 'awsElasticBlockStore' | 'gcePersistentDisk' | 'azureDisk';
    hostPath?: {
      path: string;
      type?: string;
    };
    nfs?: {
      server: string;
      path: string;
      readOnly?: boolean;
    };
    local?: {
      path: string;
    };
    awsElasticBlockStore?: {
      volumeID: string;
      fsType?: string;
      partition?: number;
      readOnly?: boolean;
    };
    gcePersistentDisk?: {
      pdName: string;
      fsType?: string;
      partition?: number;
      readOnly?: boolean;
    };
    azureDisk?: {
      diskName: string;
      diskURI: string;
      cachingMode?: 'None' | 'ReadOnly' | 'ReadWrite';
      fsType?: string;
      readOnly?: boolean;
    };
  };
  nodeAffinity?: {
    required?: {
      nodeSelectorTerms: {
        matchExpressions?: {
          key: string;
          operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist' | 'Gt' | 'Lt';
          values?: string[];
        }[];
      }[];
    };
  };
}

export const persistentVolumeTemplate = (params: PersistentVolumeTemplateParams): k8s.V1PersistentVolume => {
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

  const spec: k8s.V1PersistentVolumeSpec = {
    capacity: {
      storage: params.capacity
    },
    accessModes: params.accessModes,
    storageClassName: params.storageClassName,
    volumeMode: params.volumeMode,
    persistentVolumeReclaimPolicy: params.persistentVolumeReclaimPolicy,
    nodeAffinity: params.nodeAffinity
  };

  // Add volume source based on type
  switch (params.volumeSource.type) {
    case 'hostPath':
      spec.hostPath = params.volumeSource.hostPath;
      break;
    case 'nfs':
      spec.nfs = params.volumeSource.nfs;
      break;
    case 'local':
      spec.local = params.volumeSource.local;
      if (params.volumeSource.local && !params.nodeAffinity) {
        // Local volumes require node affinity
        console.warn('Local volumes require nodeAffinity to be set');
      }
      break;
    case 'awsElasticBlockStore':
      spec.awsElasticBlockStore = params.volumeSource.awsElasticBlockStore;
      break;
    case 'gcePersistentDisk':
      spec.gcePersistentDisk = params.volumeSource.gcePersistentDisk;
      break;
    case 'azureDisk':
      spec.azureDisk = params.volumeSource.azureDisk;
      break;
  }

  const pv: k8s.V1PersistentVolume = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name: params.name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec
  };

  return pv;
};