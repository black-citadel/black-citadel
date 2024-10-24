import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export const configMapTemplate = (
  name: string,
  namespace: string,
  labels: Label[],
  annotations: Annotation[],
  data: Label[]
): k8s.V1ConfigMap => {
  const labelsObject = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {});

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  const dataObject = data
    .filter(item => item.key && item.value)
    .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});

  return {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: name === '' ? undefined : name,
      namespace: namespace === '' ? undefined : namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
    data: Object.keys(dataObject).length > 0 ? dataObject : undefined,
  };
};
