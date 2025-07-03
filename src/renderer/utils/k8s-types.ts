// Kubernetes type definitions for renderer process
// These are extracted type definitions that mirror the @kubernetes/client-node types
// but don't require importing the actual library which has Node.js dependencies

export interface V1ObjectMeta {
  name?: string;
  namespace?: string;
  uid?: string;
  resourceVersion?: string;
  creationTimestamp?: Date;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  ownerReferences?: any[];
  finalizers?: string[];
  managedFields?: any[];
}

export interface V1DeploymentSpec {
  replicas?: number;
  selector?: {
    matchLabels?: { [key: string]: string };
  };
  template?: any;
  strategy?: any;
  minReadySeconds?: number;
  revisionHistoryLimit?: number;
  progressDeadlineSeconds?: number;
}

export interface V1DeploymentStatus {
  observedGeneration?: number;
  replicas?: number;
  updatedReplicas?: number;
  readyReplicas?: number;
  availableReplicas?: number;
  unavailableReplicas?: number;
  conditions?: any[];
}

export interface V1Deployment {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ObjectMeta;
  spec?: V1DeploymentSpec;
  status?: V1DeploymentStatus;
}

export interface V1Pod {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ObjectMeta;
  spec?: any;
  status?: any;
}

export interface V1ListMeta {
  resourceVersion?: string;
  continue?: string;
  remainingItemCount?: number;
}

export interface V1PodList {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ListMeta;
  items: V1Pod[];
}

export interface V1DeploymentList {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ListMeta;
  items: V1Deployment[];
}

export interface V1RoleBinding {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ObjectMeta;
  subjects?: any[];
  roleRef?: {
    apiGroup?: string;
    kind?: string;
    name?: string;
  };
}