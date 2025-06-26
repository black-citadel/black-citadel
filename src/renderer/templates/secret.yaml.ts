import { Label } from "@components/form/field-labels";
import { Annotation } from "@components/form/field-annotations";
import k8s from '@kubernetes/client-node';

export interface SecretTemplateParams {
  name: string;
  namespace: string;
  labels: Label[];
  annotations: Annotation[];
  type: 'Opaque' | 'kubernetes.io/service-account-token' | 'kubernetes.io/dockercfg' | 
        'kubernetes.io/dockerconfigjson' | 'kubernetes.io/basic-auth' | 'kubernetes.io/ssh-auth' | 
        'kubernetes.io/tls' | 'bootstrap.kubernetes.io/token';
  data: Array<{ key: string; value: string }>;
  stringData?: Array<{ key: string; value: string }>;
}

export const secretTemplate = (params: SecretTemplateParams): k8s.V1Secret => {
  const {
    name,
    namespace,
    labels,
    annotations,
    type,
    data,
    stringData
  } = params;

  const labelsObject = labels
    .filter(label => label.key && label.value)
    .reduce((acc, label) => ({ ...acc, [label.key]: label.value }), {});

  const annotationsObject = annotations
    .filter(annotation => annotation.key && annotation.value)
    .reduce((acc, annotation) => ({ ...acc, [annotation.key]: annotation.value }), {});

  // Convert data to base64
  const dataObject = data
    .filter(item => item.key && item.value)
    .reduce((acc, item) => ({ 
      ...acc, 
      [item.key]: Buffer.from(item.value).toString('base64') 
    }), {});

  // StringData doesn't need base64 encoding
  const stringDataObject = stringData && stringData.length > 0
    ? stringData
        .filter(item => item.key && item.value)
        .reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
    : undefined;

  const secret: k8s.V1Secret = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: name || undefined,
      namespace: namespace || undefined,
      labels: Object.keys(labelsObject).length > 0 ? labelsObject : undefined,
      annotations: Object.keys(annotationsObject).length > 0 ? annotationsObject : undefined,
    },
    type: type || 'Opaque',
    data: Object.keys(dataObject).length > 0 ? dataObject : undefined,
    stringData: stringDataObject && Object.keys(stringDataObject).length > 0 ? stringDataObject : undefined
  };

  // For certain types, ensure required keys are present
  if (type === 'kubernetes.io/basic-auth') {
    // Ensure username and password keys exist
    if (!secret.data) secret.data = {};
    if (!secret.data['username']) secret.data['username'] = '';
    if (!secret.data['password']) secret.data['password'] = '';
  } else if (type === 'kubernetes.io/ssh-auth') {
    // Ensure ssh-privatekey exists
    if (!secret.data) secret.data = {};
    if (!secret.data['ssh-privatekey']) secret.data['ssh-privatekey'] = '';
  } else if (type === 'kubernetes.io/tls') {
    // Ensure tls.crt and tls.key exist
    if (!secret.data) secret.data = {};
    if (!secret.data['tls.crt']) secret.data['tls.crt'] = '';
    if (!secret.data['tls.key']) secret.data['tls.key'] = '';
  }

  return secret;
};