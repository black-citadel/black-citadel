import * as k8s from '@kubernetes/client-node';

export interface NetworkPolicyTemplateParams {
  name: string;
  namespace: string;
  labels: { key: string; value: string }[];
  annotations: { key: string; value: string }[];
  podSelector: { key: string; value: string }[];
  policyTypes: ('Ingress' | 'Egress')[];
  ingress?: {
    from?: {
      podSelector?: { key: string; value: string }[];
      namespaceSelector?: { key: string; value: string }[];
      ipBlock?: {
        cidr: string;
        except?: string[];
      };
    }[];
    ports?: {
      protocol: 'TCP' | 'UDP' | 'SCTP';
      port?: number | string;
      endPort?: number;
    }[];
  }[];
  egress?: {
    to?: {
      podSelector?: { key: string; value: string }[];
      namespaceSelector?: { key: string; value: string }[];
      ipBlock?: {
        cidr: string;
        except?: string[];
      };
    }[];
    ports?: {
      protocol: 'TCP' | 'UDP' | 'SCTP';
      port?: number | string;
      endPort?: number;
    }[];
  }[];
}

export const networkPolicyTemplate = (params: NetworkPolicyTemplateParams): k8s.V1NetworkPolicy => {
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

  const podSelectorObject = params.podSelector.reduce((acc, selector) => {
    if (selector.key && selector.value) {
      acc[selector.key] = selector.value;
    }
    return acc;
  }, {} as Record<string, string>);

  // Transform ingress rules
  const transformedIngress = params.ingress?.map(rule => ({
    from: rule.from?.map(peer => {
      const result: k8s.V1NetworkPolicyPeer = {};
      if (peer.podSelector) {
        result.podSelector = {
          matchLabels: peer.podSelector.reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {})
        };
      }
      if (peer.namespaceSelector) {
        result.namespaceSelector = {
          matchLabels: peer.namespaceSelector.reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {})
        };
      }
      if (peer.ipBlock) {
        result.ipBlock = peer.ipBlock;
      }
      return result;
    }),
    ports: rule.ports
  }));

  // Transform egress rules
  const transformedEgress = params.egress?.map(rule => ({
    to: rule.to?.map(peer => {
      const result: k8s.V1NetworkPolicyPeer = {};
      if (peer.podSelector) {
        result.podSelector = {
          matchLabels: peer.podSelector.reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {})
        };
      }
      if (peer.namespaceSelector) {
        result.namespaceSelector = {
          matchLabels: peer.namespaceSelector.reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {})
        };
      }
      if (peer.ipBlock) {
        result.ipBlock = peer.ipBlock;
      }
      return result;
    }),
    ports: rule.ports
  }));

  const networkPolicy: k8s.V1NetworkPolicy = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'NetworkPolicy',
    metadata: {
      name: params.name,
      namespace: params.namespace,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined
    },
    spec: {
      podSelector: {
        matchLabels: podSelectorObject
      },
      policyTypes: params.policyTypes,
      ingress: transformedIngress,
      egress: transformedEgress
    }
  };

  return networkPolicy;
};