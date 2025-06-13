import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { formatStatus } from '@components/cluster/namespace/helpers';
import { Editor } from '@components/editor';
import helpObjects from '@help/index';

// Workloads
import { DeploymentList } from '@components/workloads/deployment/table';
import { PodList } from '@components/workloads/pod/table';
import { ReplicaSetList } from '@components/workloads/replicaset/table';
import { StatefulSetList } from '@components/workloads/statefulset/table';
import { DaemonSetList } from '@components/workloads/daemonset/table';
import { JobList } from '@components/workloads/job/table';
import { CronJobList } from '@components/workloads/cronjob/table';

// Networking
import { ServiceList } from '@components/networking/service/table';
import { IngressList } from '@components/networking/ingress/table';
import { EndpointsList } from '@components/networking/endpoint/table';
import { EndpointSliceList } from '@components/networking/endpoint-slice/table';
import { NetworkPolicyList } from '@components/networking/network-policy/table';

// Configuration
import { ConfigMapList } from '@components/configuration/config-map/table';
import { SecretList } from '@components/configuration/secret/table';
import { ResourceQuotaList } from '@components/configuration/resource-quota/table';
import { LimitRangeList } from '@components/configuration/limit-range/table';
import { HorizontalPodAutoscalerList } from '@components/configuration/horizontal-pod-autoscaler/table';
import { PodDisruptionBudgetList } from '@components/configuration/pod-disruption-budget/table';

// Storage
import { PersistentVolumeClaimList } from '@components/storage/persistent-volume-claim/table';

// Access Control
import { ServiceAccountList } from '@components/access-control/service-account/table';
import { RoleList } from '@components/access-control/role/table';
import { RoleBindingList } from '@components/access-control/role-binding/table';

interface ResourceData {
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

export const NamespacesDetailsView = (): JSX.Element => {
  // Debug imports
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [namespace, setNamespace] = useState<k8s.V1Namespace>();
  const [resources, setResources] = useState<ResourceData>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespace(viewContext.name);
      setNamespace(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch namespace:", e);
      setError("Failed to fetch namespace.");
    }
  };

  const fetchResources = async () => {
    if (!viewContext.name) return;
    
    try {
      setLoading(true);
      const namespaceName = viewContext.name;
      
      // Fetch all resources in parallel
      const [
        deployments,
        pods,
        replicaSets,
        statefulSets,
        daemonSets,
        jobs,
        cronJobs,
        services,
        ingresses,
        endpoints,
        endpointSlices,
        networkPolicies,
        configMaps,
        secrets,
        resourceQuotas,
        limitRanges,
        horizontalPodAutoscalers,
        podDisruptionBudgets,
        persistentVolumeClaims,
        serviceAccounts,
        roles,
        roleBindings
      ] = await Promise.all([
        // Workloads
        window.electronAPI.listDeploymentForAllNamespaces(),
        window.electronAPI.listNamespacedPod(namespaceName),
        window.electronAPI.listReplicaSetForAllNamespaces(),
        window.electronAPI.listStatefulSetForAllNamespaces(),
        window.electronAPI.listDaemonSetForAllNamespaces(),
        window.electronAPI.listJobForAllNamespaces(),
        window.electronAPI.listCronJobForAllNamespaces(),
        
        // Networking
        window.electronAPI.listServiceForAllNamespaces(),
        window.electronAPI.listIngressForAllNamespaces(),
        window.electronAPI.listEndpointsForAllNamespaces(),
        window.electronAPI.listEndpointSliceForAllNamespaces(),
        window.electronAPI.listNetworkPolicyForAllNamespaces(),
        
        // Configuration
        window.electronAPI.listConfigMapForAllNamespaces(),
        window.electronAPI.listSecretForAllNamespaces(),
        window.electronAPI.listResourceQuotaForAllNamespaces(),
        window.electronAPI.listLimitRangeForAllNamespaces(),
        window.electronAPI.listHorizontalPodAutoscalerForAllNamespaces(),
        window.electronAPI.listPodDisruptionBudgetForAllNamespaces(),
        
        // Storage
        window.electronAPI.listPersistentVolumeClaimForAllNamespaces(),
        
        // Access Control
        window.electronAPI.listServiceAccountForAllNamespaces(),
        window.electronAPI.listRoleForAllNamespaces(),
        window.electronAPI.listRoleBindingForAllNamespaces()
      ]);

      // Filter resources for this namespace
      const filterByNamespace = (list: any) => {
        if (!list || !list.items) return { items: [] };
        return {
          items: list.items.filter((item: any) => 
            item.metadata?.namespace === namespaceName
          )
        };
      };

      setResources({
        deployments: filterByNamespace(deployments),
        pods: filterByNamespace(pods),
        replicaSets: filterByNamespace(replicaSets),
        statefulSets: filterByNamespace(statefulSets),
        daemonSets: filterByNamespace(daemonSets),
        jobs: filterByNamespace(jobs),
        cronJobs: filterByNamespace(cronJobs),
        services: filterByNamespace(services),
        ingresses: filterByNamespace(ingresses),
        endpoints: filterByNamespace(endpoints),
        endpointSlices: filterByNamespace(endpointSlices),
        networkPolicies: filterByNamespace(networkPolicies),
        configMaps: filterByNamespace(configMaps),
        secrets: filterByNamespace(secrets),
        resourceQuotas: filterByNamespace(resourceQuotas),
        limitRanges: filterByNamespace(limitRanges),
        horizontalPodAutoscalers: filterByNamespace(horizontalPodAutoscalers),
        podDisruptionBudgets: filterByNamespace(podDisruptionBudgets),
        persistentVolumeClaims: filterByNamespace(persistentVolumeClaims),
        serviceAccounts: filterByNamespace(serviceAccounts),
        roles: filterByNamespace(roles),
        roleBindings: filterByNamespace(roleBindings),
      });
    } catch (e) {
      console.error("Failed to fetch resources:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchResources();
    
    const intervalId = setInterval(() => {
      fetchData();
      fetchResources();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [viewContext.name]);

  const yamlContent = dump(namespace);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespace(viewContext.name);
    setViewContext({ resource: Resources.Namespaces, action: ResourceAction.List });
  };

  const hasResources = (list?: { items: any[] }) => list && list.items && list.items.length > 0;

  return (
    <>
      <DetailsHeader error={error} onDelete={handleDelete}>
        <Heading>
          <NamespaceBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && namespace && (
        <div className='m-2'>
          <MetadataDetails metadata={namespace.metadata} />

          <Subheading className='mt-8 mb-4'>Status</Subheading>
          <DetailsItem label="Phase" help={helpObjects.namespace.status}>
            {formatStatus(namespace.status?.phase)}
          </DetailsItem>

          {!loading && (
            <>
              {/* Workloads Section */}
              {(hasResources(resources.deployments) || hasResources(resources.pods) || 
                hasResources(resources.replicaSets) || hasResources(resources.statefulSets) ||
                hasResources(resources.daemonSets) || hasResources(resources.jobs) || 
                hasResources(resources.cronJobs)) && (
                <>
                  <Heading className='mt-12 mb-6'>Workloads</Heading>
                  
                  {hasResources(resources.deployments) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Deployments</Subheading>
                      <DeploymentList deployments={resources.deployments} />
                    </>
                  )}
                  
                  {hasResources(resources.pods) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Pods</Subheading>
                      <PodList pods={resources.pods} />
                    </>
                  )}
                  
                  {hasResources(resources.replicaSets) && (
                    <>
                      <Subheading className='mt-8 mb-4'>ReplicaSets</Subheading>
                      <ReplicaSetList replicaSets={resources.replicaSets} />
                    </>
                  )}
                  
                  {hasResources(resources.statefulSets) && (
                    <>
                      <Subheading className='mt-8 mb-4'>StatefulSets</Subheading>
                      <StatefulSetList statefulSets={resources.statefulSets} />
                    </>
                  )}
                  
                  {hasResources(resources.daemonSets) && (
                    <>
                      <Subheading className='mt-8 mb-4'>DaemonSets</Subheading>
                      <DaemonSetList daemonSets={resources.daemonSets} />
                    </>
                  )}
                  
                  {hasResources(resources.jobs) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Jobs</Subheading>
                      <JobList jobs={resources.jobs} />
                    </>
                  )}
                  
                  {hasResources(resources.cronJobs) && (
                    <>
                      <Subheading className='mt-8 mb-4'>CronJobs</Subheading>
                      <CronJobList cronJobs={resources.cronJobs} />
                    </>
                  )}
                </>
              )}

              {/* Networking Section */}
              {(hasResources(resources.services) || hasResources(resources.ingresses) || 
                hasResources(resources.endpoints) || hasResources(resources.endpointSlices) ||
                hasResources(resources.networkPolicies)) && (
                <>
                  <Heading className='mt-12 mb-6'>Networking</Heading>
                  
                  {hasResources(resources.services) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Services</Subheading>
                      <ServiceList services={resources.services} />
                    </>
                  )}
                  
                  {hasResources(resources.ingresses) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Ingresses</Subheading>
                      <IngressList ingresses={resources.ingresses} />
                    </>
                  )}
                  
                  {hasResources(resources.endpoints) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Endpoints</Subheading>
                      <EndpointsList endpoints={resources.endpoints} />
                    </>
                  )}
                  
                  {hasResources(resources.endpointSlices) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Endpoint Slices</Subheading>
                      <EndpointSliceList endpointSlices={resources.endpointSlices} />
                    </>
                  )}
                  
                  {hasResources(resources.networkPolicies) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Network Policies</Subheading>
                      <NetworkPolicyList networkPolicies={resources.networkPolicies} />
                    </>
                  )}
                </>
              )}

              {/* Configuration Section */}
              {(hasResources(resources.configMaps) || hasResources(resources.secrets) || 
                hasResources(resources.resourceQuotas) || hasResources(resources.limitRanges) ||
                hasResources(resources.horizontalPodAutoscalers) || hasResources(resources.podDisruptionBudgets)) && (
                <>
                  <Heading className='mt-12 mb-6'>Configuration</Heading>
                  
                  {hasResources(resources.configMaps) && (
                    <>
                      <Subheading className='mt-8 mb-4'>ConfigMaps</Subheading>
                      <ConfigMapList configMaps={resources.configMaps} />
                    </>
                  )}
                  
                  {hasResources(resources.secrets) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Secrets</Subheading>
                      <SecretList secrets={resources.secrets} />
                    </>
                  )}
                  
                  {hasResources(resources.resourceQuotas) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Resource Quotas</Subheading>
                      <ResourceQuotaList resourceQuotas={resources.resourceQuotas} />
                    </>
                  )}
                  
                  {hasResources(resources.limitRanges) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Limit Ranges</Subheading>
                      <LimitRangeList limitRanges={resources.limitRanges} />
                    </>
                  )}
                  
                  {hasResources(resources.horizontalPodAutoscalers) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Horizontal Pod Autoscalers</Subheading>
                      <HorizontalPodAutoscalerList horizontalPodAutoscalers={resources.horizontalPodAutoscalers} />
                    </>
                  )}
                  
                  {hasResources(resources.podDisruptionBudgets) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Pod Disruption Budgets</Subheading>
                      <PodDisruptionBudgetList podDisruptionBudgets={resources.podDisruptionBudgets} />
                    </>
                  )}
                </>
              )}

              {/* Storage Section */}
              {hasResources(resources.persistentVolumeClaims) && (
                <>
                  <Heading className='mt-12 mb-6'>Storage</Heading>
                  
                  <Subheading className='mt-8 mb-4'>Persistent Volume Claims</Subheading>
                  <PersistentVolumeClaimList persistentVolumeClaims={resources.persistentVolumeClaims} />
                </>
              )}

              {/* Access Control Section */}
              {(hasResources(resources.serviceAccounts) || hasResources(resources.roles) || 
                hasResources(resources.roleBindings)) && (
                <>
                  <Heading className='mt-12 mb-6'>Access Control</Heading>
                  
                  {hasResources(resources.serviceAccounts) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Service Accounts</Subheading>
                      <ServiceAccountList serviceAccounts={resources.serviceAccounts} />
                    </>
                  )}
                  
                  {hasResources(resources.roles) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Roles</Subheading>
                      <RoleList roles={resources.roles} />
                    </>
                  )}
                  
                  {hasResources(resources.roleBindings) && (
                    <>
                      <Subheading className='mt-8 mb-4'>Role Bindings</Subheading>
                      <RoleBindingList roleBindings={resources.roleBindings} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};