import * as k8s from '@kubernetes/client-node';

export interface CronJobTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  schedule: string;
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
  concurrencyPolicy?: 'Allow' | 'Forbid' | 'Replace';
  startingDeadlineSeconds?: number;
  successfulJobsHistoryLimit?: number;
  failedJobsHistoryLimit?: number;
  suspend?: boolean;
  jobBackoffLimit?: number;
  jobActiveDeadlineSeconds?: number;
  jobTtlSecondsAfterFinished?: number;
  restartPolicy?: 'Never' | 'OnFailure';
}

export const cronJobTemplate = (params: CronJobTemplateParams): k8s.V1CronJob => {
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

  const cronJob: k8s.V1CronJob = {
    apiVersion: 'batch/v1',
    kind: 'CronJob',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      schedule: params.schedule,
      concurrencyPolicy: params.concurrencyPolicy,
      startingDeadlineSeconds: params.startingDeadlineSeconds,
      successfulJobsHistoryLimit: params.successfulJobsHistoryLimit,
      failedJobsHistoryLimit: params.failedJobsHistoryLimit,
      suspend: params.suspend,
      jobTemplate: {
        spec: {
          backoffLimit: params.jobBackoffLimit,
          activeDeadlineSeconds: params.jobActiveDeadlineSeconds,
          ttlSecondsAfterFinished: params.jobTtlSecondsAfterFinished,
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
      }
    }
  };

  return cronJob;
};