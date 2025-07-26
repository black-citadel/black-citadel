import { V1VolumeAttachment } from '@utils/k8s-types';

interface VolumeAttachmentTemplateProps {
  name: string;
  labels?: Array<{ key: string; value: string }>;
  annotations?: Array<{ key: string; value: string }>;
  attacher: string;
  nodeName: string;
  persistentVolumeName?: string;
  inlineVolumeSpec?: any;
}

export const volumeAttachmentTemplate = ({
  name,
  labels = [],
  annotations = [],
  attacher,
  nodeName,
  persistentVolumeName,
  inlineVolumeSpec
}: VolumeAttachmentTemplateProps): V1VolumeAttachment => {
  const hasLabels = labels.some(label => label.key && label.value);
  const hasAnnotations = annotations.some(annotation => annotation.key && annotation.value);

  const volumeAttachment: V1VolumeAttachment = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'VolumeAttachment',
    metadata: {
      name
    },
    spec: {
      attacher,
      nodeName,
      source: {}
    }
  };

  if (hasLabels) {
    volumeAttachment.metadata.labels = labels.reduce((acc, label) => {
      if (label.key && label.value) {
        acc[label.key] = label.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (hasAnnotations) {
    volumeAttachment.metadata.annotations = annotations.reduce((acc, annotation) => {
      if (annotation.key && annotation.value) {
        acc[annotation.key] = annotation.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  if (persistentVolumeName) {
    volumeAttachment.spec.source.persistentVolumeName = persistentVolumeName;
  } else if (inlineVolumeSpec) {
    volumeAttachment.spec.source.inlineVolumeSpec = inlineVolumeSpec;
  }

  return volumeAttachment;
};