import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export interface PodTemplateParams {
  name: string;
  namespace: string;
  labels: Label[];
  annotations: Annotation[];
  image: string;
  containerName: string;
  containerPort?: number;
  envVars: Array<{ name: string; value: string }>;
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

export const podTemplate = (params: PodTemplateParams): k8s.V1Pod => {
  const {
    name,
    namespace,
    labels,
    annotations,
    image,
    containerName,
    containerPort,
    envVars,
    resources
  } = params;

  const labelsObject: Record<string, string> = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {} as Record<string, string>);

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  const envVarsArray = envVars
    .filter(env => env.name && env.value)
    .map(env => ({
      name: env.name,
      value: env.value
    }));

  const pod: k8s.V1Pod = {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name: name || undefined,
      namespace: namespace || undefined,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
    spec: {
      containers: [
        {
          name: containerName || name || 'container',
          image: image || 'nginx:latest',
          ports: containerPort ? [{ containerPort }] : undefined,
          env: envVarsArray.length > 0 ? envVarsArray : undefined,
          resources: resources || undefined
        }
      ]
    }
  };

  return pod;
};

// Legacy function for backward compatibility
export const simplePodTemplate = (name: string, namespace: string, image: string) => ({
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: {
    name,
    namespace
  },
  spec: {
    containers: [{
      name,
      image
    }]
  }
});