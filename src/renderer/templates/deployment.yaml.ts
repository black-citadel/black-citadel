import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export interface DeploymentTemplateParams {
  name: string;
  namespace: string;
  labels: Label[];
  annotations: Annotation[];
  replicas: number;
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

export const deploymentTemplate = (params: DeploymentTemplateParams): k8s.V1Deployment => {
  const {
    name,
    namespace,
    labels,
    annotations,
    replicas,
    image,
    containerName,
    containerPort,
    envVars,
    resources
  } = params;

  const labelsObject = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {});

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  const envVarsArray = envVars
    .filter(env => env.name && env.value)
    .map(env => ({
      name: env.name,
      value: env.value
    }));

  // Create app label for selector
  const appLabel = labelsObject['app'] || name;
  const selectorLabels = { app: appLabel };
  const podLabels = { ...selectorLabels, ...labelsObject };

  const deployment: k8s.V1Deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: name || undefined,
      namespace: namespace || undefined,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
    spec: {
      replicas: replicas || 1,
      selector: {
        matchLabels: selectorLabels
      },
      template: {
        metadata: {
          labels: podLabels
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
      }
    }
  };

  return deployment;
};