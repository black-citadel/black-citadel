const { contextBridge, ipcRenderer } = require('electron');
import k8s = require('@kubernetes/client-node');

export interface ElectronAPI {
  // External links
  openExternalLink: (url: string) => Promise<void>;
  // Contexts
  getContexts: () => Promise<k8s.Context[]>;
  getCurrentContext: () => Promise<string>;
  setCurrentContext: (name: string) => Promise<void>;
  getContextObject: (name: string) => Promise<k8s.Context>;
  addContext: (context: k8s.Context) => Promise<void>;
  // Nodes
  listNode: () => Promise<k8s.V1NodeList>;
  readNode: (name: string) => Promise<k8s.V1Node>;
  topNodes: () => Promise<k8s.NodeStatus[]>;
  // Namespaces
  readNamespace: (name: string) => Promise<k8s.V1Namespace>;
  deleteNamespace: (name: string) => Promise<void>;
  listDeploymentForAllNamespaces: () => Promise<k8s.V1DeploymentList>;
  listReplicaSetForAllNamespaces: () => Promise<k8s.V1ReplicaSetList>;
  listStatefulSetForAllNamespaces: () => Promise<k8s.V1StatefulSetList>;
  listDaemonSetForAllNamespaces: () => Promise<k8s.V1DaemonSetList>;
  listJobForAllNamespaces: () => Promise<k8s.V1JobList>;
  listCronJobForAllNamespaces: () => Promise<k8s.V1CronJobList>;
  listNamespace: () => Promise<k8s.V1NamespaceList>;
  listPodForAllNamespaces: () => Promise<k8s.V1PodList>;
  listServiceForAllNamespaces: () => Promise<k8s.V1ServiceList>;
  listEndpointsForAllNamespaces: () => Promise<k8s.V1EndpointsList>;
  listConfigMapForAllNamespaces: () => Promise<k8s.V1ConfigMapList>;
  listSecretForAllNamespaces: () => Promise<k8s.V1SecretList>;
  listResourceQuotaForAllNamespaces: () => Promise<k8s.V1ResourceQuotaList>;
  listLimitRangeForAllNamespaces: () => Promise<k8s.V1LimitRangeList>;
  listPersistentVolumeClaimForAllNamespaces: () => Promise<k8s.V1PersistentVolumeClaimList>;
  listPersistentVolume: () => Promise<k8s.V1PersistentVolumeList>;
  listServiceAccountForAllNamespaces: () => Promise<k8s.V1ServiceAccountList>;
  listIngressForAllNamespaces: () => Promise<k8s.V1IngressList>;
  listIngressClass: () => Promise<k8s.V1IngressClassList>;
  listNetworkPolicyForAllNamespaces: () => Promise<k8s.V1NetworkPolicyList>;
  listEndpointSliceForAllNamespaces: () => Promise<k8s.V1EndpointSliceList>;
  listVolumeAttachment: () => Promise<k8s.V1VolumeAttachmentList>;
  listStorageClass: () => Promise<k8s.V1StorageClassList>;
  listCSINode: () => Promise<k8s.V1CSINodeList>;
  listCSIDriver: () => Promise<k8s.V1CSIDriverList>;
  listHorizontalPodAutoscalerForAllNamespaces: () => Promise<k8s.V2HorizontalPodAutoscalerList>;
  listPodDisruptionBudgetForAllNamespaces: () => Promise<k8s.V1PodDisruptionBudgetList>;
  listPriorityClass: () => Promise<k8s.V1PriorityClassList>;
  listRuntimeClass: () => Promise<k8s.V1RuntimeClassList>;
  listMutatingWebhookConfiguration: () => Promise<k8s.V1MutatingWebhookConfigurationList>;
  listValidatingWebhookConfiguration: () => Promise<k8s.V1ValidatingWebhookConfigurationList>;
  listRoleForAllNamespaces: () => Promise<k8s.V1RoleList>;
  listRoleBindingForAllNamespaces: () => Promise<k8s.V1RoleBindingList>;
  listClusterRole: () => Promise<k8s.V1ClusterRoleList>;
  listClusterRoleBinding: () => Promise<k8s.V1ClusterRoleBindingList>;
  listNamespacedPod: (namespace: string, ...args: any[]) => Promise<k8s.V1PodList>;
  
  readNamespacedService: (name: string, namespace: string) => Promise<k8s.V1Service>;
  readNamespacedConfigMap: (name: string, namespace: string) => Promise<k8s.V1ConfigMap>;
  readNamespacedSecret: (name: string, namespace: string) => Promise<k8s.V1Secret>;
  readNamespacedResourceQuota: (name: string, namespace: string) => Promise<k8s.V1ResourceQuota>;
  readNamespacedLimitRange: (name: string, namespace: string) => Promise<k8s.V1LimitRange>;
  readNamespacedHorizontalPodAutoscaler: (name: string, namespace: string) => Promise<k8s.V2HorizontalPodAutoscaler>;
  readNamespacedPodDisruptionBudget: (name: string, namespace: string) => Promise<k8s.V1PodDisruptionBudget>;
  readNamespacedIngress: (name: string, namespace: string) => Promise<k8s.V1Ingress>;
  readIngressClass: (name: string) => Promise<k8s.V1IngressClass>;
  readNamespacedEndpoints: (name: string, namespace: string) => Promise<k8s.V1Endpoint>;
  readNamespacedEndpointSlice: (name: string, namespace: string) => Promise<k8s.V1EndpointSlice>;
  readNamespacedNetworkPolicy: (name: string, namespace: string) => Promise<k8s.V1NetworkPolicy>;
  readNamespacedCronJob: (name: string, namespace: string) => Promise<k8s.V1CronJob>;
  readNamespacedDaemonSet: (name: string, namespace: string) => Promise<k8s.V1DaemonSet>;
  readNamespacedDeployment: (name: string, namespace: string) => Promise<k8s.V1Deployment>;
  readNamespacedJob: (name: string, namespace: string) => Promise<k8s.V1Job>;
  readNamespacedPod: (name: string, namespace: string) => Promise<k8s.V1Pod>;
  readNamespacedReplicaSet: (name: string, namespace: string) => Promise<k8s.V1ReplicaSet>;
  readNamespacedStatefulSet: (name: string, namespace: string) => Promise<k8s.V1StatefulSet>;
  readMutatingWebhookConfiguration: (name: string) => Promise<k8s.V1MutatingWebhookConfiguration>;
  readPriorityClass: (name: string) => Promise<k8s.V1PriorityClass>;
  readRuntimeClass: (name: string) => Promise<k8s.V1RuntimeClass>;
  readValidatingWebhookConfiguration: (name: string) => Promise<k8s.V1ValidatingWebhookConfiguration>;
  readClusterRoleBinding: (name: string) => Promise<k8s.V1ClusterRoleBinding>;
  readClusterRole: (name: string) => Promise<k8s.V1ClusterRole>;
  readNamespacedRoleBinding: (name: string, namespace: string) => Promise<k8s.V1RoleBinding>;
  readNamespacedRole: (name: string, namespace: string) => Promise<k8s.V1Role>;
  readNamespacedServiceAccount: (name: string, namespace: string) => Promise<k8s.V1ServiceAccount>;
  readCSIDriver: (name: string) => Promise<k8s.V1CSIDriver>;
  readCSINode: (name: string) => Promise<k8s.V1CSINode>;
  readNamespacedPersistentVolumeClaim: (name: string, namespace: string) => Promise<k8s.V1PersistentVolumeClaim>;
  readPersistentVolume: (name: string) => Promise<k8s.V1PersistentVolume>;
  readStorageClass: (name: string) => Promise<k8s.V1StorageClass>;
  readVolumeAttachment: (name: string) => Promise<k8s.V1VolumeAttachment>;
  createNamespace: (payload: k8s.V1Namespace) => Promise<{ success: boolean, data?: k8s.V1Namespace, error?: string }>;
  createNamespacedPod: (namespace: string, podSpec: k8s.V1Pod) => Promise<{ success: boolean, data?: k8s.V1Pod, error?: string }>;
  deleteNamespacedPod: (name: string, namespace: string) => Promise<void>;
  readNamespacedPodLog: (name: string, namespace: string, container?: string, options?: { follow?: boolean, previous?: boolean, sinceSeconds?: number, tailLines?: number, timestamps?: boolean, pretty?: string }) => Promise<{ success: boolean, data?: string, error?: string }>;
  createNamespacedConfigMap: (namespace: string, payload: k8s.V1ConfigMap) => Promise<{ success: boolean, data?: k8s.V1ConfigMap, error?: string }>;
  deleteNamespacedConfigMap: (name: string, namespace: string) => Promise<void>;
  // Custom Resource Definitions
  listCustomResourceDefinition: () => Promise<k8s.V1CustomResourceDefinitionList>;
  readCustomResourceDefinition: (name: string) => Promise<k8s.V1CustomResourceDefinition>;
  // Events
  listEventForAllNamespaces: () => Promise<k8s.CoreV1EventList>;
  listNamespacedEvent: (namespace: string) => Promise<k8s.CoreV1EventList>;
  readNamespacedEvent: (name: string, namespace: string) => Promise<k8s.CoreV1Event>;
}

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    // External links
    openExternalLink: (url: string) => ipcRenderer.invoke('openExternalLink', url),
    // Contexts
    getContexts: () => ipcRenderer.invoke('getContexts'),
    getCurrentContext: () => ipcRenderer.invoke('getCurrentContext'),
    setCurrentContext: (name: string) => ipcRenderer.invoke('setCurrentContext', name),
    getContextObject: (name: string) => ipcRenderer.invoke('getContextObject', name),
    addContext: (context: k8s.Context) => ipcRenderer.invoke('addContext', context),
    // Nodes
    listNode: () => ipcRenderer.invoke('listNode'),
    readNode: (name: string) => ipcRenderer.invoke('readNode', name),
    topNodes: () => ipcRenderer.invoke('topNodes'),
    listDeploymentForAllNamespaces: () => ipcRenderer.invoke('listDeploymentForAllNamespaces'),
    listReplicaSetForAllNamespaces: () => ipcRenderer.invoke('listReplicaSetForAllNamespaces'),
    listStatefulSetForAllNamespaces: () => ipcRenderer.invoke('listStatefulSetForAllNamespaces'),
    listDaemonSetForAllNamespaces: () => ipcRenderer.invoke('listDaemonSetForAllNamespaces'),
    listJobForAllNamespaces: () => ipcRenderer.invoke('listJobForAllNamespaces'),
    listCronJobForAllNamespaces: () => ipcRenderer.invoke('listCronJobForAllNamespaces'),
    listNamespace: () => ipcRenderer.invoke('listNamespace'),
    listPodForAllNamespaces: () => ipcRenderer.invoke('listPodForAllNamespaces'),
    listServiceForAllNamespaces: () => ipcRenderer.invoke('listServiceForAllNamespaces'),
    listEndpointsForAllNamespaces: () => ipcRenderer.invoke('listEndpointsForAllNamespaces'),
    listConfigMapForAllNamespaces: () => ipcRenderer.invoke('listConfigMapForAllNamespaces'),
    listSecretForAllNamespaces: () => ipcRenderer.invoke('listSecretForAllNamespaces'),
    listResourceQuotaForAllNamespaces: () => ipcRenderer.invoke('listResourceQuotaForAllNamespaces'),
    listLimitRangeForAllNamespaces: () => ipcRenderer.invoke('listLimitRangeForAllNamespaces'),
    listPersistentVolumeClaimForAllNamespaces: () => ipcRenderer.invoke('listPersistentVolumeClaimForAllNamespaces'),
    listPersistentVolume: () => ipcRenderer.invoke('listPersistentVolume'),
    listServiceAccountForAllNamespaces: () => ipcRenderer.invoke('listServiceAccountForAllNamespaces'),
    listIngressForAllNamespaces: () => ipcRenderer.invoke('listIngressForAllNamespaces'),
    listIngressClass: () => ipcRenderer.invoke('listIngressClass'),
    listNetworkPolicyForAllNamespaces: () => ipcRenderer.invoke('listNetworkPolicyForAllNamespaces'),
    listEndpointSliceForAllNamespaces: () => ipcRenderer.invoke('listEndpointSliceForAllNamespaces'),
    listVolumeAttachment: () => ipcRenderer.invoke('listVolumeAttachment'),
    listStorageClass: () => ipcRenderer.invoke('listStorageClass'),
    listCSINode: () => ipcRenderer.invoke('listCSINode'),
    listCSIDriver: () => ipcRenderer.invoke('listCSIDriver'),
    listHorizontalPodAutoscalerForAllNamespaces: () => ipcRenderer.invoke('listHorizontalPodAutoscalerForAllNamespaces'),
    listPodDisruptionBudgetForAllNamespaces: () => ipcRenderer.invoke('listPodDisruptionBudgetForAllNamespaces'),
    listPriorityClass: () => ipcRenderer.invoke('listPriorityClass'),
    listRuntimeClass: () => ipcRenderer.invoke('listRuntimeClass'),
    listMutatingWebhookConfiguration: () => ipcRenderer.invoke('listMutatingWebhookConfiguration'),
    listValidatingWebhookConfiguration: () => ipcRenderer.invoke('listValidatingWebhookConfiguration'),
    listRoleForAllNamespaces: () => ipcRenderer.invoke('listRoleForAllNamespaces'),
    listRoleBindingForAllNamespaces: () => ipcRenderer.invoke('listRoleBindingForAllNamespaces'),
    listClusterRole: () => ipcRenderer.invoke('listClusterRole'),
    listClusterRoleBinding: () => ipcRenderer.invoke('listClusterRoleBinding'),
    listNamespacedPod: (namespace: string, ...args: any[]) => ipcRenderer.invoke('listNamespacedPod', namespace, ...args),
    readNamespacedService: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedService', name, namespace),
    readNamespace: (name: string) => ipcRenderer.invoke('readNamespace', name),
    readNamespacedConfigMap: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedConfigMap', name, namespace),
    readNamespacedSecret: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedSecret', name, namespace),
    readNamespacedResourceQuota: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedResourceQuota', name, namespace),
    readNamespacedLimitRange: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedLimitRange', name, namespace),
    readNamespacedHorizontalPodAutoscaler: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedHorizontalPodAutoscaler', name, namespace),
    readNamespacedPodDisruptionBudget: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedPodDisruptionBudget', name, namespace),
    readNamespacedIngress: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedIngress', name, namespace),
    readIngressClass: (name: string) => ipcRenderer.invoke('readIngressClass', name),
    readNamespacedEndpoints: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedEndpoints', name, namespace),
    readNamespacedEndpointSlice: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedEndpointSlice', name, namespace),
    readNamespacedNetworkPolicy: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedNetworkPolicy', name, namespace),
    readNamespacedCronJob: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedCronJob', name, namespace),
    readNamespacedDaemonSet: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedDaemonSet', name, namespace),
    readNamespacedDeployment: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedDeployment', name, namespace),
    readNamespacedJob: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedJob', name, namespace),
    readNamespacedPod: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedPod', name, namespace),
    readNamespacedReplicaSet: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedReplicaSet', name, namespace),
    readNamespacedStatefulSet: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedStatefulSet', name, namespace),
    readMutatingWebhookConfiguration: (name: string) => ipcRenderer.invoke('readMutatingWebhookConfiguration', name),
    readPriorityClass: (name: string) => ipcRenderer.invoke('readPriorityClass', name),
    readRuntimeClass: (name: string) => ipcRenderer.invoke('readRuntimeClass', name),
    readValidatingWebhookConfiguration: (name: string) => ipcRenderer.invoke('readValidatingWebhookConfiguration', name),
    readClusterRoleBinding: (name: string) => ipcRenderer.invoke('readClusterRoleBinding', name),
    readClusterRole: (name: string) => ipcRenderer.invoke('readClusterRole', name),
    readNamespacedRoleBinding: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedRoleBinding', name, namespace),
    readNamespacedRole: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedRole', name, namespace),
    readNamespacedServiceAccount: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedServiceAccount', name, namespace),
    readCSIDriver: (name: string) => ipcRenderer.invoke('readCSIDriver', name),
    readCSINode: (name: string) => ipcRenderer.invoke('readCSINode', name),
    readNamespacedPersistentVolumeClaim: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedPersistentVolumeClaim', name, namespace),
    readPersistentVolume: (name: string) => ipcRenderer.invoke('readPersistentVolume', name),
    readStorageClass: (name: string) => ipcRenderer.invoke('readStorageClass', name),
    readVolumeAttachment: (name: string) => ipcRenderer.invoke('readVolumeAttachment', name),
    createNamespace: (payload: k8s.V1Namespace) => ipcRenderer.invoke('createNamespace', payload),
    deleteNamespace: (name: string) => ipcRenderer.invoke('deleteNamespace', name),
    createNamespacedPod: (namespace: string, podSpec: k8s.V1Pod) => ipcRenderer.invoke('createNamespacedPod', namespace, podSpec),
    deleteNamespacedPod: (name: string, namespace: string) => ipcRenderer.invoke('deleteNamespacedPod', name, namespace),
    readNamespacedPodLog: (name: string, namespace: string, container?: string, options?: { follow?: boolean, previous?: boolean, sinceSeconds?: number, tailLines?: number, timestamps?: boolean, pretty?: string }) => ipcRenderer.invoke('readNamespacedPodLog', name, namespace, container, options),
    createNamespacedConfigMap: (namespace: string, payload: k8s.V1ConfigMap) => ipcRenderer.invoke('createNamespacedConfigMap', namespace, payload),
    deleteNamespacedConfigMap: (name: string, namespace: string) => ipcRenderer.invoke('deleteNamespacedConfigMap', name, namespace),
    // Custom Resource Definitions
    listCustomResourceDefinition: () => ipcRenderer.invoke('listCustomResourceDefinition'),
    readCustomResourceDefinition: (name: string) => ipcRenderer.invoke('readCustomResourceDefinition', name),
    // Events
    listEventForAllNamespaces: () => ipcRenderer.invoke('listEventForAllNamespaces'),
    listNamespacedEvent: (namespace: string) => ipcRenderer.invoke('listNamespacedEvent', namespace),
    readNamespacedEvent: (name: string, namespace: string) => ipcRenderer.invoke('readNamespacedEvent', name, namespace),
  } as ElectronAPI);
} catch (error) {
  console.error(error)
}