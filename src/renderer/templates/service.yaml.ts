import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export interface ServiceTemplateParams {
  name: string;
  namespace: string;
  labels: Label[];
  annotations: Annotation[];
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';
  selector: Label[];
  ports: Array<{
    name?: string;
    port: number;
    targetPort: number | string;
    protocol?: 'TCP' | 'UDP' | 'SCTP';
    nodePort?: number;
  }>;
  sessionAffinity?: 'None' | 'ClientIP';
  externalName?: string; // For ExternalName type
  loadBalancerIP?: string; // For LoadBalancer type
  externalTrafficPolicy?: 'Cluster' | 'Local';
}

export const serviceTemplate = (params: ServiceTemplateParams): k8s.V1Service => {
  const {
    name,
    namespace,
    labels,
    annotations,
    type,
    selector,
    ports,
    sessionAffinity,
    externalName,
    loadBalancerIP,
    externalTrafficPolicy
  } = params;

  const labelsObject = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {});

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  const selectorObject = selector
    .filter(sel => sel.key && sel.value)
    .reduce((acc, sel) => ({ ...acc, [sel.key]: sel.value }), {});

  const servicePorts = ports
    .filter(port => port.port && port.targetPort)
    .map(port => ({
      ...(port.name && { name: port.name }),
      port: port.port,
      targetPort: port.targetPort,
      protocol: port.protocol || 'TCP',
      ...(type === 'NodePort' && port.nodePort && { nodePort: port.nodePort })
    }));

  const service: k8s.V1Service = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: name || undefined,
      namespace: namespace || undefined,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
    spec: {
      type: type || 'ClusterIP',
      selector: type !== 'ExternalName' && Object.keys(selectorObject).length > 0 ? selectorObject : undefined,
      ports: servicePorts.length > 0 ? servicePorts : undefined,
      sessionAffinity: sessionAffinity || 'None',
      ...(type === 'ExternalName' && externalName && { externalName }),
      ...(type === 'LoadBalancer' && loadBalancerIP && { loadBalancerIP }),
      ...(externalTrafficPolicy && (type === 'NodePort' || type === 'LoadBalancer') && { externalTrafficPolicy })
    }
  };

  return service;
};