import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/base/table';
import k8s from '@kubernetes/client-node';

// Import badges and resource links for each resource type
// Workloads
import { DeploymentBadge } from '@components/workloads/deployment/badge';
import { DeploymentResourceLink } from '@components/workloads/deployment/resource-link';
import { PodBadge } from '@components/workloads/pod/badge';
import { PodResourceLink } from '@components/workloads/pod/resource-link';
import { ReplicaSetBadge } from '@components/workloads/replicaset/badge';
import { ReplicaSetResourceLink } from '@components/workloads/replicaset/resource-link';
import { StatefulSetBadge } from '@components/workloads/statefulset/badge';
import { StatefulSetResourceLink } from '@components/workloads/statefulset/resource-link';
import { DaemonSetBadge } from '@components/workloads/daemonset/badge';
import { DaemonSetResourceLink } from '@components/workloads/daemonset/resource-link';
import { JobBadge } from '@components/workloads/job/badge';
import { JobResourceLink } from '@components/workloads/job/resource-link';
import { CronJobBadge } from '@components/workloads/cronjob/badge';
import { CronJobResourceLink } from '@components/workloads/cronjob/resource-link';

// Networking
import { ServiceBadge } from '@components/networking/service/badge';
import { ServiceResourceLink } from '@components/networking/service/resource-link';
import { IngressBadge } from '@components/networking/ingress/badge';
import { IngressResourceLink } from '@components/networking/ingress/resource-link';
import { EndpointBadge } from '@components/networking/endpoint/badge';
import { EndpointResourceLink } from '@components/networking/endpoint/resource-link';
import { EndpointSliceBadge } from '@components/networking/endpoint-slice/badge';
import { EndpointSliceResourceLink } from '@components/networking/endpoint-slice/resource-link';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { NetworkPolicyResourceLink } from '@components/networking/network-policy/resource-link';

// Configuration
import { ConfigMapBadge } from '@components/configuration/config-map/badge';
import { ConfigMapResourceLink } from '@components/configuration/config-map/resource-link';
import { SecretBadge } from '@components/configuration/secret/badge';
import { SecretResourceLink } from '@components/configuration/secret/resource-link';
import { ResourceQuotaBadge } from '@components/configuration/resource-quota/badge';
import { ResourceQuotaResourceLink } from '@components/configuration/resource-quota/resource-link';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
import { LimitRangeResourceLink } from '@components/configuration/limit-range/resource-link';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { HorizontalPodAutoscalerResourceLink } from '@components/configuration/horizontal-pod-autoscaler/resource-link';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { PodDisruptionBudgetResourceLink } from '@components/configuration/pod-disruption-budget/resource-link';

// Storage
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { PersistentVolumeClaimResourceLink } from '@components/storage/persistent-volume-claim/resource-link';

// Access Control
import { ServiceAccountBadge } from '@components/access-control/service-account/badge';
import { ServiceAccountResourceLink } from '@components/access-control/service-account/resource-link';
import { RoleBadge } from '@components/access-control/role/badge';
import { RoleResourceLink } from '@components/access-control/role/resource-link';
import { RoleBindingBadge } from '@components/access-control/role-binding/badge';
import { RoleBindingResourceLink } from '@components/access-control/role-binding/resource-link';

interface ResourceItem {
  type: string;
  category: string;
  name: string;
  resource: any;
  BadgeComponent: React.ComponentType<{ resource?: any }>;
  LinkComponent: React.ComponentType<{ name: string; namespace: string }>;
}

interface NamespaceResourcesTableProps {
  // Workloads
  deployments?: k8s.V1DeploymentList;
  pods?: k8s.V1PodList;
  replicaSets?: k8s.V1ReplicaSetList;
  statefulSets?: k8s.V1StatefulSetList;
  daemonSets?: k8s.V1DaemonSetList;
  jobs?: k8s.V1JobList;
  cronJobs?: k8s.V1CronJobList;
  
  // Networking
  services?: k8s.V1ServiceList;
  ingresses?: k8s.V1IngressList;
  endpoints?: k8s.V1EndpointsList;
  endpointSlices?: k8s.V1EndpointSliceList;
  networkPolicies?: k8s.V1NetworkPolicyList;
  
  // Configuration
  configMaps?: k8s.V1ConfigMapList;
  secrets?: k8s.V1SecretList;
  resourceQuotas?: k8s.V1ResourceQuotaList;
  limitRanges?: k8s.V1LimitRangeList;
  horizontalPodAutoscalers?: k8s.V2HorizontalPodAutoscalerList;
  podDisruptionBudgets?: k8s.V1PodDisruptionBudgetList;
  
  // Storage
  persistentVolumeClaims?: k8s.V1PersistentVolumeClaimList;
  
  // Access Control
  serviceAccounts?: k8s.V1ServiceAccountList;
  roles?: k8s.V1RoleList;
  roleBindings?: k8s.V1RoleBindingList;
}

export function NamespaceResourcesTable(props: NamespaceResourcesTableProps) {
  const resources: ResourceItem[] = [];

  // Helper function to add resources
  const addResources = (
    list: any,
    type: string,
    category: string,
    BadgeComponent: React.ComponentType<{ resource?: any }>,
    LinkComponent: React.ComponentType<{ name: string; namespace: string }>
  ) => {
    if (list?.items?.length > 0) {
      list.items.forEach((item: any) => {
        resources.push({
          type,
          category,
          name: item.metadata?.name || '',
          resource: item,
          BadgeComponent,
          LinkComponent
        });
      });
    }
  };

  // Add all resources
  // Workloads
  addResources(props.deployments, 'Deployment', 'Workloads', DeploymentBadge, DeploymentResourceLink);
  addResources(props.pods, 'Pod', 'Workloads', PodBadge, PodResourceLink);
  addResources(props.replicaSets, 'ReplicaSet', 'Workloads', ReplicaSetBadge, ReplicaSetResourceLink);
  addResources(props.statefulSets, 'StatefulSet', 'Workloads', StatefulSetBadge, StatefulSetResourceLink);
  addResources(props.daemonSets, 'DaemonSet', 'Workloads', DaemonSetBadge, DaemonSetResourceLink);
  addResources(props.jobs, 'Job', 'Workloads', JobBadge, JobResourceLink);
  addResources(props.cronJobs, 'CronJob', 'Workloads', CronJobBadge, CronJobResourceLink);
  
  // Networking
  addResources(props.services, 'Service', 'Networking', ServiceBadge, ServiceResourceLink);
  addResources(props.ingresses, 'Ingress', 'Networking', IngressBadge, IngressResourceLink);
  addResources(props.endpoints, 'Endpoints', 'Networking', EndpointBadge, EndpointResourceLink);
  addResources(props.endpointSlices, 'EndpointSlice', 'Networking', EndpointSliceBadge, EndpointSliceResourceLink);
  addResources(props.networkPolicies, 'NetworkPolicy', 'Networking', NetworkPolicyBadge, NetworkPolicyResourceLink);
  
  // Configuration
  addResources(props.configMaps, 'ConfigMap', 'Configuration', ConfigMapBadge, ConfigMapResourceLink);
  addResources(props.secrets, 'Secret', 'Configuration', SecretBadge, SecretResourceLink);
  addResources(props.resourceQuotas, 'ResourceQuota', 'Configuration', ResourceQuotaBadge, ResourceQuotaResourceLink);
  addResources(props.limitRanges, 'LimitRange', 'Configuration', LimitRangeBadge, LimitRangeResourceLink);
  addResources(props.horizontalPodAutoscalers, 'HorizontalPodAutoscaler', 'Configuration', HorizontalPodAutoscalerBadge, HorizontalPodAutoscalerResourceLink);
  addResources(props.podDisruptionBudgets, 'PodDisruptionBudget', 'Configuration', PodDisruptionBudgetBadge, PodDisruptionBudgetResourceLink);
  
  // Storage
  addResources(props.persistentVolumeClaims, 'PersistentVolumeClaim', 'Storage', PersistentVolumeClaimBadge, PersistentVolumeClaimResourceLink);
  
  // Access Control
  addResources(props.serviceAccounts, 'ServiceAccount', 'Access Control', ServiceAccountBadge, ServiceAccountResourceLink);
  addResources(props.roles, 'Role', 'Access Control', RoleBadge, RoleResourceLink);
  addResources(props.roleBindings, 'RoleBinding', 'Access Control', RoleBindingBadge, RoleBindingResourceLink);

  // Sort resources by category, then type, then name
  resources.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    return a.name.localeCompare(b.name);
  });

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No resources found in this namespace
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {resources.map((item, index) => (
          <TableRow key={`${item.type}-${item.name}-${index}`}>
            <TableCell>
              <item.LinkComponent 
                name={item.resource.metadata?.name || ''} 
                namespace={item.resource.metadata?.namespace || ''}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}