import { V1CSIDriver } from '@utils/k8s-types';

interface TokenRequest {
  audience: string;
  expirationSeconds?: number;
}

interface CSIDriverTemplateProps {
  name: string;
  labels?: Array<{ key: string; value: string }>;
  annotations?: Array<{ key: string; value: string }>;
  attachRequired?: boolean;
  podInfoOnMount?: boolean;
  storageCapacity?: boolean;
  fsGroupPolicy?: 'ReadWriteOnceWithFSType' | 'File' | 'None';
  requiresRepublish?: boolean;
  volumeLifecycleModes?: string[];
  tokenRequests?: TokenRequest[];
}

export const csiDriverTemplate = ({
  name,
  labels = [],
  annotations = [],
  attachRequired,
  podInfoOnMount,
  storageCapacity,
  fsGroupPolicy,
  requiresRepublish,
  volumeLifecycleModes = [],
  tokenRequests = []
}: CSIDriverTemplateProps): V1CSIDriver => {
  const hasLabels = labels.some(label => label.key && label.value);
  const hasAnnotations = annotations.some(annotation => annotation.key && annotation.value);

  const csiDriver: V1CSIDriver = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'CSIDriver',
    metadata: {
      name
    },
    spec: {}
  };

  if (hasLabels) {
    csiDriver.metadata.labels = labels.reduce((acc, label) => {
      if (label.key && label.value) {
        acc[label.key] = label.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (hasAnnotations) {
    csiDriver.metadata.annotations = annotations.reduce((acc, annotation) => {
      if (annotation.key && annotation.value) {
        acc[annotation.key] = annotation.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (attachRequired !== undefined) {
    csiDriver.spec.attachRequired = attachRequired;
  }

  if (podInfoOnMount !== undefined) {
    csiDriver.spec.podInfoOnMount = podInfoOnMount;
  }

  if (storageCapacity !== undefined) {
    csiDriver.spec.storageCapacity = storageCapacity;
  }

  if (fsGroupPolicy) {
    csiDriver.spec.fsGroupPolicy = fsGroupPolicy;
  }

  if (requiresRepublish !== undefined) {
    csiDriver.spec.requiresRepublish = requiresRepublish;
  }

  if (volumeLifecycleModes.length > 0) {
    csiDriver.spec.volumeLifecycleModes = volumeLifecycleModes;
  }

  if (tokenRequests.length > 0) {
    csiDriver.spec.tokenRequests = tokenRequests.map(req => ({
      audience: req.audience,
      ...(req.expirationSeconds !== undefined && { expirationSeconds: req.expirationSeconds })
    }));
  }

  return csiDriver;
};