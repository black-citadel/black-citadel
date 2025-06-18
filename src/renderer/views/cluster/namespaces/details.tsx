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
import { NamespaceResourcesTable } from '@components/cluster/namespace/resources-table';

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

          <Heading className='mt-12 mb-6'>Resources</Heading>
          <NamespaceResourcesTable
            deployments={deployments}
            pods={pods}
            replicaSets={replicaSets}
            statefulSets={statefulSets}
            daemonSets={daemonSets}
            jobs={jobs}
            cronJobs={cronJobs}
            services={services}
            ingresses={ingresses}
            endpoints={endpoints}
            endpointSlices={endpointSlices}
            networkPolicies={networkPolicies}
            configMaps={configMaps}
            secrets={secrets}
            resourceQuotas={resourceQuotas}
            limitRanges={limitRanges}
            horizontalPodAutoscalers={horizontalPodAutoscalers}
            podDisruptionBudgets={podDisruptionBudgets}
            persistentVolumeClaims={persistentVolumeClaims}
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