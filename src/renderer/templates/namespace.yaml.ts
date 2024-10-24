import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export const namespaceTemplate = (name: string, labels: Label[], annotations: Annotation[]): k8s.V1Namespace => {
  const labelsObject = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {});

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: name === '' ? undefined : name,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
  };
};
