import * as k8s from '@kubernetes/client-node';

export interface IngressTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  className?: string;
  rules: {
    host: string;
    paths: {
      path: string;
      pathType: 'Prefix' | 'Exact' | 'ImplementationSpecific';
      serviceName: string;
      servicePort: number | string;
    }[];
  }[];
  tls?: {
    hosts: string[];
    secretName: string;
  }[];
}

export const ingressTemplate = (params: IngressTemplateParams): k8s.V1Ingress => {
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

  const ingress: k8s.V1Ingress = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      ingressClassName: params.className,
      rules: params.rules.map(rule => ({
        host: rule.host,
        http: {
          paths: rule.paths.map(path => ({
            path: path.path,
            pathType: path.pathType,
            backend: {
              service: {
                name: path.serviceName,
                port: {
                  number: typeof path.servicePort === 'number' ? path.servicePort : undefined,
                  name: typeof path.servicePort === 'string' ? path.servicePort : undefined
                }
              }
            }
          }))
        }
      })),
      tls: params.tls && params.tls.length > 0 ? params.tls : undefined
    }
  };

  return ingress;
};