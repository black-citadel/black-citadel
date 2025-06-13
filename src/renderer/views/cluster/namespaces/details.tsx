import { useEffect, useState, memo, useCallback } from 'react';
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

// Helper function
const hasResources = (list?: { items: any[] }) => list && list.items && list.items.length > 0;

// Memoized resource sections to prevent re-renders
const WorkloadsSection = memo(({ 
  deployments,
  pods,
  replicaSets,
  statefulSets,
  daemonSets,
  jobs,
  cronJobs
}: {
  deployments?: k8s.V1DeploymentList;
  pods?: k8s.V1PodList;
  replicaSets?: k8s.V1ReplicaSetList;
  statefulSets?: k8s.V1StatefulSetList;
  daemonSets?: k8s.V1DaemonSetList;
  jobs?: k8s.V1JobList;
  cronJobs?: k8s.V1CronJobList;
}) => {
  if (!hasResources(deployments) && !hasResources(pods) && 
      !hasResources(replicaSets) && !hasResources(statefulSets) &&
      !hasResources(daemonSets) && !hasResources(jobs) && 
      !hasResources(cronJobs)) {
    return null;
  }

  return (
    <>
      <Heading className='mt-12 mb-6'>Workloads</Heading>
      
      {hasResources(deployments) && (
        <>
          <Subheading className='mt-8 mb-4'>Deployments</Subheading>
          <DeploymentList deployments={deployments} />
        </>
      )}
      
      {hasResources(pods) && (
        <>
          <Subheading className='mt-8 mb-4'>Pods</Subheading>
          <PodList pods={pods} />
        </>
      )}
      
      {hasResources(replicaSets) && (
        <>
          <Subheading className='mt-8 mb-4'>ReplicaSets</Subheading>
          <ReplicaSetList replicaSets={replicaSets} />
        </>
      )}
      
      {hasResources(statefulSets) && (
        <>
          <Subheading className='mt-8 mb-4'>StatefulSets</Subheading>
          <StatefulSetList statefulSets={statefulSets} />
        </>
      )}
      
      {hasResources(daemonSets) && (
        <>
          <Subheading className='mt-8 mb-4'>DaemonSets</Subheading>
          <DaemonSetList daemonSets={daemonSets} />
        </>
      )}
      
      {hasResources(jobs) && (
        <>
          <Subheading className='mt-8 mb-4'>Jobs</Subheading>
          <JobList jobs={jobs} />
        </>
      )}
      
      {hasResources(cronJobs) && (
        <>
          <Subheading className='mt-8 mb-4'>CronJobs</Subheading>
          <CronJobList cronJobs={cronJobs} />
        </>
      )}
    </>
  );
});
WorkloadsSection.displayName = 'WorkloadsSection';

const NetworkingSection = memo(({
  services,
  ingresses,
  endpoints,
  endpointSlices,
  networkPolicies
}: {
  services?: k8s.V1ServiceList;
  ingresses?: k8s.V1IngressList;
  endpoints?: k8s.V1EndpointsList;
  endpointSlices?: k8s.V1EndpointSliceList;
  networkPolicies?: k8s.V1NetworkPolicyList;
}) => {
  if (!hasResources(services) && !hasResources(ingresses) && 
      !hasResources(endpoints) && !hasResources(endpointSlices) &&
      !hasResources(networkPolicies)) {
    return null;
  }

  return (
    <>
      <Heading className='mt-12 mb-6'>Networking</Heading>
      
      {hasResources(services) && (
        <>
          <Subheading className='mt-8 mb-4'>Services</Subheading>
          <ServiceList services={services} />
        </>
      )}
      
      {hasResources(ingresses) && (
        <>
          <Subheading className='mt-8 mb-4'>Ingresses</Subheading>
          <IngressList ingresses={ingresses} />
        </>
      )}
      
      {hasResources(endpoints) && (
        <>
          <Subheading className='mt-8 mb-4'>Endpoints</Subheading>
          <EndpointsList endpoints={endpoints} />
        </>
      )}
      
      {hasResources(endpointSlices) && (
        <>
          <Subheading className='mt-8 mb-4'>Endpoint Slices</Subheading>
          <EndpointSliceList endpointSlices={endpointSlices} />
        </>
      )}
      
      {hasResources(networkPolicies) && (
        <>
          <Subheading className='mt-8 mb-4'>Network Policies</Subheading>
          <NetworkPolicyList networkPolicies={networkPolicies} />
        </>
      )}
    </>
  );
});
NetworkingSection.displayName = 'NetworkingSection';

const ConfigurationSection = memo(({
  configMaps,
  secrets,
  resourceQuotas,
  limitRanges,
  horizontalPodAutoscalers,
  podDisruptionBudgets
}: {
  configMaps?: k8s.V1ConfigMapList;
  secrets?: k8s.V1SecretList;
  resourceQuotas?: k8s.V1ResourceQuotaList;
  limitRanges?: k8s.V1LimitRangeList;
  horizontalPodAutoscalers?: k8s.V2HorizontalPodAutoscalerList;
  podDisruptionBudgets?: k8s.V1PodDisruptionBudgetList;
}) => {
  if (!hasResources(configMaps) && !hasResources(secrets) && 
      !hasResources(resourceQuotas) && !hasResources(limitRanges) &&
      !hasResources(horizontalPodAutoscalers) && !hasResources(podDisruptionBudgets)) {
    return null;
  }

  return (
    <>
      <Heading className='mt-12 mb-6'>Configuration</Heading>
      
      {hasResources(configMaps) && (
        <>
          <Subheading className='mt-8 mb-4'>ConfigMaps</Subheading>
          <ConfigMapList configMaps={configMaps} />
        </>
      )}
      
      {hasResources(secrets) && (
        <>
          <Subheading className='mt-8 mb-4'>Secrets</Subheading>
          <SecretList secrets={secrets} />
        </>
      )}
      
      {hasResources(resourceQuotas) && (
        <>
          <Subheading className='mt-8 mb-4'>Resource Quotas</Subheading>
          <ResourceQuotaList resourceQuotas={resourceQuotas} />
        </>
      )}
      
      {hasResources(limitRanges) && (
        <>
          <Subheading className='mt-8 mb-4'>Limit Ranges</Subheading>
          <LimitRangeList limitRanges={limitRanges} />
        </>
      )}
      
      {hasResources(horizontalPodAutoscalers) && (
        <>
          <Subheading className='mt-8 mb-4'>Horizontal Pod Autoscalers</Subheading>
          <HorizontalPodAutoscalerList hpas={horizontalPodAutoscalers} />
        </>
      )}
      
      {hasResources(podDisruptionBudgets) && (
        <>
          <Subheading className='mt-8 mb-4'>Pod Disruption Budgets</Subheading>
          <PodDisruptionBudgetList pdbs={podDisruptionBudgets} />
        </>
      )}
    </>
  );
});
ConfigurationSection.displayName = 'ConfigurationSection';

const StorageSection = memo(({
  persistentVolumeClaims
}: {
  persistentVolumeClaims?: k8s.V1PersistentVolumeClaimList;
}) => {
  if (!hasResources(persistentVolumeClaims)) {
    return null;
  }

  return (
    <>
      <Heading className='mt-12 mb-6'>Storage</Heading>
      
      <Subheading className='mt-8 mb-4'>Persistent Volume Claims</Subheading>
      <PersistentVolumeClaimList pvcs={persistentVolumeClaims} />
    </>
  );
});
StorageSection.displayName = 'StorageSection';

const AccessControlSection = memo(({
  serviceAccounts,
  roles,
  roleBindings
}: {
  serviceAccounts?: k8s.V1ServiceAccountList;
  roles?: k8s.V1RoleList;
  roleBindings?: k8s.V1RoleBindingList;
}) => {
  if (!hasResources(serviceAccounts) && !hasResources(roles) && 
      !hasResources(roleBindings)) {
    return null;
  }

  return (
    <>
      <Heading className='mt-12 mb-6'>Access Control</Heading>
      
      {hasResources(serviceAccounts) && (
        <>
          <Subheading className='mt-8 mb-4'>Service Accounts</Subheading>
          <ServiceAccountList serviceAccounts={serviceAccounts} />
        </>
      )}
      
      {hasResources(roles) && (
        <>
          <Subheading className='mt-8 mb-4'>Roles</Subheading>
          <RoleList roles={roles} />
        </>
      )}
      
      {hasResources(roleBindings) && (
        <>
          <Subheading className='mt-8 mb-4'>Role Bindings</Subheading>
          <RoleBindingList roleBindings={roleBindings} />
        </>
      )}
    </>
  );
});
AccessControlSection.displayName = 'AccessControlSection';

export const NamespacesDetailsView = (): JSX.Element => {
  // Debug imports
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [namespace, setNamespace] = useState<k8s.V1Namespace>();
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Separate state for each resource type
  const [deployments, setDeployments] = useState<k8s.V1DeploymentList>();
  const [pods, setPods] = useState<k8s.V1PodList>();
  const [replicaSets, setReplicaSets] = useState<k8s.V1ReplicaSetList>();
  const [statefulSets, setStatefulSets] = useState<k8s.V1StatefulSetList>();
  const [daemonSets, setDaemonSets] = useState<k8s.V1DaemonSetList>();
  const [jobs, setJobs] = useState<k8s.V1JobList>();
  const [cronJobs, setCronJobs] = useState<k8s.V1CronJobList>();
  const [services, setServices] = useState<k8s.V1ServiceList>();
  const [ingresses, setIngresses] = useState<k8s.V1IngressList>();
  const [endpoints, setEndpoints] = useState<k8s.V1EndpointsList>();
  const [endpointSlices, setEndpointSlices] = useState<k8s.V1EndpointSliceList>();
  const [networkPolicies, setNetworkPolicies] = useState<k8s.V1NetworkPolicyList>();
  const [configMaps, setConfigMaps] = useState<k8s.V1ConfigMapList>();
  const [secrets, setSecrets] = useState<k8s.V1SecretList>();
  const [resourceQuotas, setResourceQuotas] = useState<k8s.V1ResourceQuotaList>();
  const [limitRanges, setLimitRanges] = useState<k8s.V1LimitRangeList>();
  const [horizontalPodAutoscalers, setHorizontalPodAutoscalers] = useState<k8s.V2HorizontalPodAutoscalerList>();
  const [podDisruptionBudgets, setPodDisruptionBudgets] = useState<k8s.V1PodDisruptionBudgetList>();
  const [persistentVolumeClaims, setPersistentVolumeClaims] = useState<k8s.V1PersistentVolumeClaimList>();
  const [serviceAccounts, setServiceAccounts] = useState<k8s.V1ServiceAccountList>();
  const [roles, setRoles] = useState<k8s.V1RoleList>();
  const [roleBindings, setRoleBindings] = useState<k8s.V1RoleBindingList>();

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
      const namespaceName = viewContext.name;
      
      // Fetch all resources in parallel
      const [
        deploymentsData,
        podsData,
        replicaSetsData,
        statefulSetsData,
        daemonSetsData,
        jobsData,
        cronJobsData,
        servicesData,
        ingressesData,
        endpointsData,
        endpointSlicesData,
        networkPoliciesData,
        configMapsData,
        secretsData,
        resourceQuotasData,
        limitRangesData,
        horizontalPodAutoscalersData,
        podDisruptionBudgetsData,
        persistentVolumeClaimsData,
        serviceAccountsData,
        rolesData,
        roleBindingsData
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

      // Update each resource state individually
      setDeployments(filterByNamespace(deploymentsData));
      setPods(filterByNamespace(podsData));
      setReplicaSets(filterByNamespace(replicaSetsData));
      setStatefulSets(filterByNamespace(statefulSetsData));
      setDaemonSets(filterByNamespace(daemonSetsData));
      setJobs(filterByNamespace(jobsData));
      setCronJobs(filterByNamespace(cronJobsData));
      setServices(filterByNamespace(servicesData));
      setIngresses(filterByNamespace(ingressesData));
      setEndpoints(filterByNamespace(endpointsData));
      setEndpointSlices(filterByNamespace(endpointSlicesData));
      setNetworkPolicies(filterByNamespace(networkPoliciesData));
      setConfigMaps(filterByNamespace(configMapsData));
      setSecrets(filterByNamespace(secretsData));
      setResourceQuotas(filterByNamespace(resourceQuotasData));
      setLimitRanges(filterByNamespace(limitRangesData));
      setHorizontalPodAutoscalers(filterByNamespace(horizontalPodAutoscalersData));
      setPodDisruptionBudgets(filterByNamespace(podDisruptionBudgetsData));
      setPersistentVolumeClaims(filterByNamespace(persistentVolumeClaimsData));
      setServiceAccounts(filterByNamespace(serviceAccountsData));
      setRoles(filterByNamespace(rolesData));
      setRoleBindings(filterByNamespace(roleBindingsData));
      
      // Mark initial load as complete
      if (initialLoad) {
        setInitialLoad(false);
      }
    } catch (e) {
      console.error("Failed to fetch resources:", e);
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
        <div className='m-2' key={viewContext.name}>
          <MetadataDetails metadata={namespace.metadata} />

          <Subheading className='mt-8 mb-4'>Status</Subheading>
          <DetailsItem label="Phase" help={helpObjects.namespace.status}>
            {formatStatus(namespace.status?.phase)}
          </DetailsItem>

          <WorkloadsSection 
            deployments={deployments}
            pods={pods}
            replicaSets={replicaSets}
            statefulSets={statefulSets}
            daemonSets={daemonSets}
            jobs={jobs}
            cronJobs={cronJobs}
          />
          <NetworkingSection 
            services={services}
            ingresses={ingresses}
            endpoints={endpoints}
            endpointSlices={endpointSlices}
            networkPolicies={networkPolicies}
          />
          <ConfigurationSection 
            configMaps={configMaps}
            secrets={secrets}
            resourceQuotas={resourceQuotas}
            limitRanges={limitRanges}
            horizontalPodAutoscalers={horizontalPodAutoscalers}
            podDisruptionBudgets={podDisruptionBudgets}
          />
          <StorageSection 
            persistentVolumeClaims={persistentVolumeClaims}
          />
          <AccessControlSection 
            serviceAccounts={serviceAccounts}
            roles={roles}
            roleBindings={roleBindings}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};