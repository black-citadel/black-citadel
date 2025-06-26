import * as k8s from '@kubernetes/client-node';

export interface JobTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  image: string;
  containerName?: string;
  command?: string[];
  args?: string[];
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
  completions?: number;
  parallelism?: number;
  backoffLimit?: number;
  activeDeadlineSeconds?: number;
  ttlSecondsAfterFinished?: number;
  restartPolicy?: 'Never' | 'OnFailure';
}

export const jobTemplate = (params: JobTemplateParams): k8s.V1Job => {
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
    command: params.command && params.command.length > 0 ? params.command : undefined,
    args: params.args && params.args.length > 0 ? params.args : undefined,
    env: params.envVars.filter(env => env.name && env.value).map(env => ({
      name: env.name,
      value: env.value
    })),
    resources: params.resources
  };

  const job: k8s.V1Job = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      completions: params.completions,
      parallelism: params.parallelism,
      backoffLimit: params.backoffLimit,
      activeDeadlineSeconds: params.activeDeadlineSeconds,
      ttlSecondsAfterFinished: params.ttlSecondsAfterFinished,
      template: {
        metadata: {
          labels: labelsObject
        },
        spec: {
          restartPolicy: params.restartPolicy || 'Never',
          containers: [container]
        }
      }
    }
  };

  return job;
};