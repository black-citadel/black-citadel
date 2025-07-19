import { Resources } from '@utils/enums';

export const resourceTypeNames: Partial<Record<Resources, string>> = {
  // General
  [Resources.Welcome]: 'Welcome',
  
  // Settings
  [Resources.Contexts]: 'Context',
  [Resources.Preferences]: 'Preferences',
  
  // Cluster
  [Resources.Nodes]: 'Node',
  [Resources.Namespaces]: 'Namespace',
  [Resources.Events]: 'Event',
  [Resources.CustomResourceDefinitions]: 'CustomResourceDefinition',
  [Resources.CustomResources]: 'CustomResource',
  [Resources.Lease]: 'Lease',
  
  // Workloads
  [Resources.Deployments]: 'Deployment',
  [Resources.Pods]: 'Pod',
  [Resources.ReplicaSets]: 'ReplicaSet',
  [Resources.StatefulSets]: 'StatefulSet',
  [Resources.DaemonSets]: 'DaemonSet',
  [Resources.Jobs]: 'Job',
  [Resources.CronJobs]: 'CronJob',
  
  // Networking
  [Resources.Services]: 'Service',
  [Resources.Ingresses]: 'Ingress',
  [Resources.IngressClasses]: 'IngressClass',
  [Resources.Endpoints]: 'Endpoints',
  [Resources.EndpointSlices]: 'EndpointSlice',
  [Resources.NetworkPolicies]: 'NetworkPolicy',
  
  // Configuration
  [Resources.ConfigMaps]: 'ConfigMap',
  [Resources.Secrets]: 'Secret',
  [Resources.ResourceQuotas]: 'ResourceQuota',
  [Resources.LimitRanges]: 'LimitRange',
  [Resources.HorizontalPodAutoscalers]: 'HorizontalPodAutoscaler',
  [Resources.PodDisruptionBudgets]: 'PodDisruptionBudget',
  
  // Storage
  [Resources.PersistentVolumeClaims]: 'PersistentVolumeClaim',
  [Resources.PersistentVolumes]: 'PersistentVolume',
  [Resources.VolumeAttachments]: 'VolumeAttachment',
  [Resources.StorageClasses]: 'StorageClass',
  [Resources.CSIDrivers]: 'CSIDriver',
  [Resources.CSINodes]: 'CSINode',
  
  // Access Control
  [Resources.ServiceAccounts]: 'ServiceAccount',
  [Resources.Roles]: 'Role',
  [Resources.RoleBindings]: 'RoleBinding',
  [Resources.ClusterRoles]: 'ClusterRole',
  [Resources.ClusterRoleBindings]: 'ClusterRoleBinding',
  
  // Administration
  [Resources.PriorityClasses]: 'PriorityClass',
  [Resources.RuntimeClasses]: 'RuntimeClass',
  [Resources.MutatingWebhookConfigurations]: 'MutatingWebhookConfiguration',
  [Resources.ValidatingWebhookConfigurations]: 'ValidatingWebhookConfiguration',
  
  // Operations
  [Resources.PortForwards]: 'PortForward',
  [Resources.MCPServer]: 'MCP Server',
};

export function getResourceTypeName(resourceType: Resources): string {
  return resourceTypeNames[resourceType] || resourceType;
}