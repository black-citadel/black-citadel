import { useState, useEffect } from 'react';
import { SidebarLayout } from '@components/base/sidebar-layout'
import { WelcomeView } from '@views/welcome/welcome';
import { DeploymentsListView, DeploymentsDetailsView, DeploymentsCreateView } from '@views/workloads/deployments'
import { PodsListView, PodsDetailsView, PodsCreateView } from '@views/workloads/pods'
import { ReplicaSetsListView, ReplicaSetsDetailsView, ReplicaSetsCreateView } from '@views/workloads/replicasets';
import { StatefulSetsListView, StatefulSetsDetailsView, StatefulSetsCreateView } from '@views/workloads/statefulsets';
import { DaemonSetsDetailsView, DaemonSetsListView, DaemonSetsCreateView } from '@views/workloads/daemonsets';
import { JobsDetailsView, JobsListView, JobsCreateView } from '@views/workloads/jobs';
import { CronJobsListView, CronJobsDetailsView, CronJobsCreateView } from '@views/workloads/cronjobs';
import { ServicesListView, ServicesDetailsView, ServicesCreateView } from '@views/networking/services';
import { IngressesDetailsView, IngressesListView, IngressesCreateView } from '@views/networking/ingresses';
import { IngressClassesDetailsView, IngressClassesListView, IngressClassesCreateView } from '@views/networking/ingress-classes';
import { EndpointsDetailsView, EndpointsListView } from '@views/networking/endpoints';
import { EndpointSlicesDetailsView, EndpointSlicesListView } from '@views/networking/endpoint-slices';
import { NetworkPoliciesDetailsView, NetworkPoliciesListView, NetworkPoliciesCreateView } from '@views/networking/network-policies';
import { ConfigMapsCreateView, ConfigMapsDetailsView, ConfigMapsListView } from '@views/configuration/config-maps';
import { SecretsDetailsView, SecretsListView, SecretsCreateView } from '@views/configuration/secrets';
import { ResourceQuotasDetailsView, ResourceQuotasListView, ResourceQuotasCreateView } from '@views/configuration/resource-quotas';
import { LimitRangesDetailsView, LimitRangesListView, LimitRangesCreateView } from '@views/configuration/limit-ranges';
import { HorizontalPodAutoscalersDetailsView, HorizontalPodAutoscalersListView, HorizontalPodAutoscalersCreateView } from '@views/configuration/horizontal-pod-autoscalers';
import { PodDisruptionBudgetsDetailsView, PodDisruptionBudgetsListView, PodDisruptionBudgetsCreateView } from '@views/configuration/pod-disruption-budgets';
import { PersistentVolumeClaimsDetailsView, PersistentVolumeClaimsListView, PersistentVolumeClaimsCreateView } from '@views/storage/persistent-volume-claims';
import { PersistentVolumesDetailsView, PersistentVolumesListView, PersistentVolumesCreateView } from '@views/storage/persistent-volumes';
import { VolumeAttachmentsDetailsView, VolumeAttachmentsListView } from '@views/storage/volume-attachments';
import { StorageClassesDetailsView, StorageClassesListView, StorageClassesCreateView } from '@views/storage/storage-classes';
import { CSIDriversDetailsView, CSIDriversListView } from '@views/storage/csi-drivers';
import { CSINodesDetailsView, CSINodesListView } from '@views/storage/csi-nodes';
import { ServiceAccountsDetailsView, ServiceAccountsListView, ServiceAccountsCreateView } from '@views/access-control/service-accounts';
import { RolesDetailsView, RolesListView, RolesCreateView } from '@views/access-control/roles';
import { RoleBindingsDetailsView, RoleBindingsListView, RoleBindingsCreateView } from '@views/access-control/role-bindings';
import { ClusterRolesDetailsView, ClusterRolesListView, ClusterRolesCreateView } from '@views/access-control/cluster-roles';
import { ClusterRoleBindingsDetailsView, ClusterRoleBindingsListView, ClusterRoleBindingsCreateView } from '@views/access-control/cluster-role-bindings';
import { PriorityClassesDetailsView, PriorityClassesListView, PriorityClassesCreateView } from '@views/administration/priority-classes';
import { RuntimeClassesDetailsView, RuntimeClassesListView, RuntimeClassesCreateView } from '@views/administration/runtime-classes';
import { MutatingWebhookConfigurationsDetailsView, MutatingWebhookConfigurationsListView } from '@views/administration/mutating-webhook-configuration';
import { ValidatingWebhookConfigurationsDetailsView, ValidatingWebhookConfigurationsListView } from '@views/administration/validating-webhook-configuration';
import { NamespacesListView, NamespacesDetailsView, NamespacesCreateView } from '@views/cluster/namespaces';
import { useView } from './context/viewProvider'
import { Resources, ResourceAction } from '@utils/enums';
import { Sidebar, SidebarBody, SidebarItem, SidebarLabel, SidebarSection, SidebarHeading, SidebarHeader } from '@components/base/sidebar'
import { ContextsListView, ContextsDetailsView, ContextsCreateView } from '@views/cluster/contexts';
import { ContextDropdown } from '@components/context-dropdown';
import { Badge } from '@components/base/badge';
import { Drawer } from '@components/base/drawer';
import { NodeDetailsView, NodesListView } from '@views/cluster/nodes';
import { CustomResourceDefinitionsListView, CustomResourceDefinitionsDetailsView } from '@views/cluster/custom-resource-definitions';
import { CustomResourceDetailsView } from '@views/cluster/custom-resources';
import { EventsListView, EventsDetailsView } from '@views/cluster/events';
import { PortForwardsListView } from '@views/tools/port-forwards';
import { MCPServerListView, MCPServerDetailsView } from '@views/operations/mcp-server';
import { PreferencesListView } from '@views/settings/preferences';

export const Layout = () => {
  const { viewContext, setViewContext, drawerOpen, setDrawerOpen, helpTitle, helpContent, canGoBack, canGoForward, goBack, goForward } = useView()
  const [activePortForwards, setActivePortForwards] = useState(0);
  const [activeMCPConnections, setActiveMCPConnections] = useState(0);

  // Fetch active port forward count
  useEffect(() => {
    const fetchPortForwardCount = async () => {
      try {
        const portForwards = await window.electronAPI.listPortForwards();
        setActivePortForwards(portForwards.filter(pf => pf.status === 'Active').length);
      } catch (e) {
        console.error('Failed to fetch port forward count:', e);
      }
    };

    fetchPortForwardCount();
    const intervalId = setInterval(fetchPortForwardCount, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch active MCP connection count
  useEffect(() => {
    const fetchMCPConnectionCount = async () => {
      try {
        const connections = await window.electronAPI.getMCPConnections();
        setActiveMCPConnections(connections.length);
      } catch (e) {
        console.error('Failed to fetch MCP connection count:', e);
      }
    };

    fetchMCPConnectionCount();
    const intervalId = setInterval(fetchMCPConnectionCount, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Check if we should show the sidebar
  const showSidebar = viewContext.resource !== Resources.Welcome;

  // If on welcome page, render without sidebar
  if (!showSidebar) {
    return (
      <div className="w-full h-screen">
        <WelcomeView />
      </div>
    );
  }

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="flex flex-col gap-2">
                <ContextDropdown />
                <div className="flex items-center gap-2">
                  <button
                    onClick={goBack}
                    disabled={!canGoBack}
                    className={`p-1 rounded ${canGoBack ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}`}
                    title="Go back (Alt+Left or Mouse button 3)"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goForward}
                    disabled={!canGoForward}
                    className={`p-1 rounded ${canGoForward ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}`}
                    title="Go forward (Alt+Right or Mouse button 4)"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </SidebarSection>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Cluster</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Namespaces, action: ResourceAction.List })} current={viewContext.resource === Resources.Namespaces}>
                <SidebarLabel>{Resources.Namespaces}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Nodes, action: ResourceAction.List })} current={viewContext.resource === Resources.Nodes}>
                <SidebarLabel>{Resources.Nodes}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Events, action: ResourceAction.List })} current={viewContext.resource === Resources.Events}>
                <SidebarLabel>{Resources.Events}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.CustomResourceDefinitions, action: ResourceAction.List })} current={viewContext.resource === Resources.CustomResourceDefinitions}>
                <SidebarLabel>{Resources.CustomResourceDefinitions}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>Workloads</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Deployments, action: ResourceAction.List })} current={viewContext.resource == Resources.Deployments}>
                <SidebarLabel>{Resources.Deployments}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Pods, action: ResourceAction.List })} current={viewContext.resource === Resources.Pods}>
                <SidebarLabel>{Resources.Pods}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ReplicaSets, action: ResourceAction.List })} current={viewContext.resource === Resources.ReplicaSets}>
                <SidebarLabel>{Resources.ReplicaSets}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.StatefulSets, action: ResourceAction.List })} current={viewContext.resource === Resources.StatefulSets}>
                <SidebarLabel>{Resources.StatefulSets}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.DaemonSets, action: ResourceAction.List })} current={viewContext.resource === Resources.DaemonSets}>
                <SidebarLabel>{Resources.DaemonSets}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Jobs, action: ResourceAction.List })} current={viewContext.resource === Resources.Jobs}>
                <SidebarLabel>{Resources.Jobs}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.CronJobs, action: ResourceAction.List })} current={viewContext.resource === Resources.CronJobs}>
                <SidebarLabel>{Resources.CronJobs}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Networking</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Services, action: ResourceAction.List })} current={viewContext.resource === Resources.Services}>
                <SidebarLabel>{Resources.Services}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Ingresses, action: ResourceAction.List })} current={viewContext.resource === Resources.Ingresses}>
                <SidebarLabel>{Resources.Ingresses}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.IngressClasses, action: ResourceAction.List })} current={viewContext.resource === Resources.IngressClasses}>
                <SidebarLabel>{Resources.IngressClasses}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Endpoints, action: ResourceAction.List })} current={viewContext.resource === Resources.Endpoints}>
                <SidebarLabel>{Resources.Endpoints}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.EndpointSlices, action: ResourceAction.List })} current={viewContext.resource === Resources.EndpointSlices}>
                <SidebarLabel>{Resources.EndpointSlices}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.NetworkPolicies, action: ResourceAction.List })} current={viewContext.resource === Resources.NetworkPolicies}>
                <SidebarLabel>{Resources.NetworkPolicies}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Configuration</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ConfigMaps, action: ResourceAction.List })} current={viewContext.resource === Resources.ConfigMaps}>
                <SidebarLabel>{Resources.ConfigMaps}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Secrets, action: ResourceAction.List })} current={viewContext.resource === Resources.Secrets}>
                <SidebarLabel>{Resources.Secrets}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ResourceQuotas, action: ResourceAction.List })} current={viewContext.resource === Resources.ResourceQuotas}>
                <SidebarLabel>{Resources.ResourceQuotas}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.LimitRanges, action: ResourceAction.List })} current={viewContext.resource === Resources.LimitRanges}>
                <SidebarLabel>{Resources.LimitRanges}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.HorizontalPodAutoscalers, action: ResourceAction.List })} current={viewContext.resource === Resources.HorizontalPodAutoscalers}>
                <SidebarLabel>{Resources.HorizontalPodAutoscalers}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.PodDisruptionBudgets, action: ResourceAction.List })} current={viewContext.resource === Resources.PodDisruptionBudgets}>
                <SidebarLabel>{Resources.PodDisruptionBudgets}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Storage</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.PersistentVolumeClaims, action: ResourceAction.List })} current={viewContext.resource === Resources.PersistentVolumeClaims}>
                <SidebarLabel>{Resources.PersistentVolumeClaims}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.PersistentVolumes, action: ResourceAction.List })} current={viewContext.resource === Resources.PersistentVolumes}>
                <SidebarLabel>{Resources.PersistentVolumes}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.StorageClasses, action: ResourceAction.List })} current={viewContext.resource === Resources.StorageClasses}>
                <SidebarLabel>{Resources.StorageClasses}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.VolumeAttachments, action: ResourceAction.List })} current={viewContext.resource === Resources.VolumeAttachments}>
                <SidebarLabel>{Resources.VolumeAttachments}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.CSIDrivers, action: ResourceAction.List })} current={viewContext.resource === Resources.CSIDrivers}>
                <SidebarLabel>{Resources.CSIDrivers}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.CSINodes, action: ResourceAction.List })} current={viewContext.resource === Resources.CSINodes}>
                <SidebarLabel>{Resources.CSINodes}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Access Control</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ServiceAccounts, action: ResourceAction.List })} current={viewContext.resource === Resources.ServiceAccounts}>
                <SidebarLabel>{Resources.ServiceAccounts}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Roles, action: ResourceAction.List })} current={viewContext.resource === Resources.Roles}>
                <SidebarLabel>{Resources.Roles}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.RoleBindings, action: ResourceAction.List })} current={viewContext.resource === Resources.RoleBindings}>
                <SidebarLabel>{Resources.RoleBindings}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ClusterRoles, action: ResourceAction.List })} current={viewContext.resource === Resources.ClusterRoles}>
                <SidebarLabel>{Resources.ClusterRoles}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ClusterRoleBindings, action: ResourceAction.List })} current={viewContext.resource === Resources.ClusterRoleBindings}>
                <SidebarLabel>{Resources.ClusterRoleBindings}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Administration</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.PriorityClasses, action: ResourceAction.List })} current={viewContext.resource === Resources.PriorityClasses}>
                <SidebarLabel>{Resources.PriorityClasses}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.RuntimeClasses, action: ResourceAction.List })} current={viewContext.resource === Resources.RuntimeClasses}>
                <SidebarLabel>{Resources.RuntimeClasses}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.MutatingWebhookConfigurations, action: ResourceAction.List })} current={viewContext.resource === Resources.MutatingWebhookConfigurations}>
                <SidebarLabel>{Resources.MutatingWebhookConfigurations}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.ValidatingWebhookConfigurations, action: ResourceAction.List })} current={viewContext.resource === Resources.ValidatingWebhookConfigurations}>
                <SidebarLabel>{Resources.ValidatingWebhookConfigurations}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Operations</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.PortForwards, action: ResourceAction.List })} current={viewContext.resource === Resources.PortForwards}>
                <SidebarLabel>
                  {Resources.PortForwards}
                  {activePortForwards > 0 && (
                    <Badge color="green" className="ml-2">{activePortForwards}</Badge>
                  )}
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.MCPServer, action: ResourceAction.List })} current={viewContext.resource === Resources.MCPServer}>
                <SidebarLabel>
                  {Resources.MCPServer}
                  {activeMCPConnections > 0 && (
                    <Badge color="green" className="ml-2">{activeMCPConnections}</Badge>
                  )}
                </SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Settings</SidebarHeading>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Welcome, action: ResourceAction.List })} current={viewContext.resource === Resources.Welcome}>
                <SidebarLabel>Welcome</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Contexts, action: ResourceAction.List })} current={viewContext.resource === Resources.Contexts}>
                <SidebarLabel>{Resources.Contexts}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.Preferences, action: ResourceAction.List })} current={viewContext.resource === Resources.Preferences}>
                <SidebarLabel>{Resources.Preferences}</SidebarLabel>
              </SidebarItem>
              <SidebarItem onClick={() => setViewContext({ resource: Resources.License, action: ResourceAction.List })} current={viewContext.resource === Resources.License}>
                <SidebarLabel>{Resources.License}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="w-full mx-auto">
        {/* Welcome */}
        {viewContext.resource === Resources.Welcome && <WelcomeView />}
        
        {/* Cluster */}
        {viewContext.resource == Resources.Contexts && viewContext.action === ResourceAction.List && <ContextsListView />}
        {viewContext.resource == Resources.Contexts && viewContext.action === ResourceAction.Details && <ContextsDetailsView />}
        {viewContext.resource == Resources.Contexts && viewContext.action === ResourceAction.Create && <ContextsCreateView />}

        {viewContext.resource == Resources.Nodes && viewContext.action === ResourceAction.List && <NodesListView />}
        {viewContext.resource == Resources.Nodes && viewContext.action === ResourceAction.Details && <NodeDetailsView />}

        {viewContext.resource === Resources.Events && viewContext.action === ResourceAction.List && <EventsListView />}
        {viewContext.resource === Resources.Events && viewContext.action === ResourceAction.Details && <EventsDetailsView />}

        {viewContext.resource === Resources.CustomResourceDefinitions && viewContext.action === ResourceAction.List && <CustomResourceDefinitionsListView />}
        {viewContext.resource === Resources.CustomResourceDefinitions && viewContext.action === ResourceAction.Details && <CustomResourceDefinitionsDetailsView />}

        {viewContext.resource === Resources.CustomResources && viewContext.action === ResourceAction.Details && <CustomResourceDetailsView />}

        {viewContext.resource === Resources.Namespaces && viewContext.action === ResourceAction.List && <NamespacesListView />}
        {viewContext.resource === Resources.Namespaces && viewContext.action === ResourceAction.Details && <NamespacesDetailsView />}
        {viewContext.resource === Resources.Namespaces && viewContext.action === ResourceAction.Create && <NamespacesCreateView />}

        {/* Workloads */}
        {viewContext.resource == Resources.Deployments && viewContext.action === ResourceAction.List && <DeploymentsListView />}
        {viewContext.resource == Resources.Deployments && viewContext.action === ResourceAction.Details && <DeploymentsDetailsView />}
        {viewContext.resource == Resources.Deployments && viewContext.action === ResourceAction.Create && <DeploymentsCreateView />}

        {viewContext.resource == Resources.Pods && viewContext.action === ResourceAction.List && <PodsListView />}
        {viewContext.resource == Resources.Pods && viewContext.action === ResourceAction.Details && <PodsDetailsView />}
        {viewContext.resource == Resources.Pods && viewContext.action === ResourceAction.Create && <PodsCreateView />}

        {viewContext.resource == Resources.ReplicaSets && viewContext.action === ResourceAction.List && <ReplicaSetsListView />}
        {viewContext.resource == Resources.ReplicaSets && viewContext.action === ResourceAction.Details && <ReplicaSetsDetailsView />}
        {viewContext.resource == Resources.ReplicaSets && viewContext.action === ResourceAction.Create && <ReplicaSetsCreateView />}

        {viewContext.resource == Resources.StatefulSets && viewContext.action === ResourceAction.List && <StatefulSetsListView />}
        {viewContext.resource == Resources.StatefulSets && viewContext.action === ResourceAction.Details && <StatefulSetsDetailsView />}
        {viewContext.resource == Resources.StatefulSets && viewContext.action === ResourceAction.Create && <StatefulSetsCreateView />}

        {viewContext.resource == Resources.DaemonSets && viewContext.action === ResourceAction.List && <DaemonSetsListView />}
        {viewContext.resource == Resources.DaemonSets && viewContext.action === ResourceAction.Details && <DaemonSetsDetailsView />}
        {viewContext.resource == Resources.DaemonSets && viewContext.action === ResourceAction.Create && <DaemonSetsCreateView />}

        {viewContext.resource == Resources.Jobs && viewContext.action === ResourceAction.List && <JobsListView />}
        {viewContext.resource == Resources.Jobs && viewContext.action === ResourceAction.Details && <JobsDetailsView />}
        {viewContext.resource == Resources.Jobs && viewContext.action === ResourceAction.Create && <JobsCreateView />}

        {viewContext.resource == Resources.CronJobs && viewContext.action === ResourceAction.List && <CronJobsListView />}
        {viewContext.resource == Resources.CronJobs && viewContext.action === ResourceAction.Details && <CronJobsDetailsView />}
        {viewContext.resource == Resources.CronJobs && viewContext.action === ResourceAction.Create && <CronJobsCreateView />}


        {/* Networking */}
        {viewContext.resource === Resources.Services && viewContext.action === ResourceAction.List && <ServicesListView />}
        {viewContext.resource === Resources.Services && viewContext.action === ResourceAction.Details && <ServicesDetailsView />}
        {viewContext.resource === Resources.Services && viewContext.action === ResourceAction.Create && <ServicesCreateView />}

        {viewContext.resource === Resources.Ingresses && viewContext.action === ResourceAction.List && <IngressesListView />}
        {viewContext.resource === Resources.Ingresses && viewContext.action === ResourceAction.Details && <IngressesDetailsView />}
        {viewContext.resource === Resources.Ingresses && viewContext.action === ResourceAction.Create && <IngressesCreateView />}

        {viewContext.resource === Resources.IngressClasses && viewContext.action === ResourceAction.List && <IngressClassesListView />}
        {viewContext.resource === Resources.IngressClasses && viewContext.action === ResourceAction.Details && <IngressClassesDetailsView />}
        {viewContext.resource === Resources.IngressClasses && viewContext.action === ResourceAction.Create && <IngressClassesCreateView />}

        {viewContext.resource === Resources.Endpoints && viewContext.action === ResourceAction.List && <EndpointsListView />}
        {viewContext.resource === Resources.Endpoints && viewContext.action === ResourceAction.Details && <EndpointsDetailsView />}

        {viewContext.resource === Resources.EndpointSlices && viewContext.action === ResourceAction.List && <EndpointSlicesListView />}
        {viewContext.resource === Resources.EndpointSlices && viewContext.action === ResourceAction.Details && <EndpointSlicesDetailsView />}

        {viewContext.resource === Resources.NetworkPolicies && viewContext.action === ResourceAction.List && <NetworkPoliciesListView />}
        {viewContext.resource === Resources.NetworkPolicies && viewContext.action === ResourceAction.Details && <NetworkPoliciesDetailsView />}
        {viewContext.resource === Resources.NetworkPolicies && viewContext.action === ResourceAction.Create && <NetworkPoliciesCreateView />}

        {/* Configuration */}
        {viewContext.resource === Resources.ConfigMaps && viewContext.action === ResourceAction.List && <ConfigMapsListView />}
        {viewContext.resource === Resources.ConfigMaps && viewContext.action === ResourceAction.Details && <ConfigMapsDetailsView />}
        {viewContext.resource === Resources.ConfigMaps && viewContext.action === ResourceAction.Create && <ConfigMapsCreateView />}

        {viewContext.resource === Resources.Secrets && viewContext.action === ResourceAction.List && <SecretsListView />}
        {viewContext.resource === Resources.Secrets && viewContext.action === ResourceAction.Details && <SecretsDetailsView />}
        {viewContext.resource === Resources.Secrets && viewContext.action === ResourceAction.Create && <SecretsCreateView />}

        {viewContext.resource === Resources.ResourceQuotas && viewContext.action === ResourceAction.List && <ResourceQuotasListView />}
        {viewContext.resource === Resources.ResourceQuotas && viewContext.action === ResourceAction.Details && <ResourceQuotasDetailsView />}
        {viewContext.resource === Resources.ResourceQuotas && viewContext.action === ResourceAction.Create && <ResourceQuotasCreateView />}

        {viewContext.resource === Resources.LimitRanges && viewContext.action === ResourceAction.List && <LimitRangesListView />}
        {viewContext.resource === Resources.LimitRanges && viewContext.action === ResourceAction.Details && <LimitRangesDetailsView />}
        {viewContext.resource === Resources.LimitRanges && viewContext.action === ResourceAction.Create && <LimitRangesCreateView />}

        {viewContext.resource === Resources.HorizontalPodAutoscalers && viewContext.action === ResourceAction.List && <HorizontalPodAutoscalersListView />}
        {viewContext.resource === Resources.HorizontalPodAutoscalers && viewContext.action === ResourceAction.Details && <HorizontalPodAutoscalersDetailsView />}
        {viewContext.resource === Resources.HorizontalPodAutoscalers && viewContext.action === ResourceAction.Create && <HorizontalPodAutoscalersCreateView />}

        {viewContext.resource === Resources.PodDisruptionBudgets && viewContext.action === ResourceAction.List && <PodDisruptionBudgetsListView />}
        {viewContext.resource === Resources.PodDisruptionBudgets && viewContext.action === ResourceAction.Details && <PodDisruptionBudgetsDetailsView />}
        {viewContext.resource === Resources.PodDisruptionBudgets && viewContext.action === ResourceAction.Create && <PodDisruptionBudgetsCreateView />}

        {/* Storage */}
        {viewContext.resource === Resources.PersistentVolumeClaims && viewContext.action === ResourceAction.List && <PersistentVolumeClaimsListView />}
        {viewContext.resource === Resources.PersistentVolumeClaims && viewContext.action === ResourceAction.Details && <PersistentVolumeClaimsDetailsView />}
        {viewContext.resource === Resources.PersistentVolumeClaims && viewContext.action === ResourceAction.Create && <PersistentVolumeClaimsCreateView />}

        {viewContext.resource === Resources.PersistentVolumes && viewContext.action === ResourceAction.List && <PersistentVolumesListView />}
        {viewContext.resource === Resources.PersistentVolumes && viewContext.action === ResourceAction.Details && <PersistentVolumesDetailsView />}
        {viewContext.resource === Resources.PersistentVolumes && viewContext.action === ResourceAction.Create && <PersistentVolumesCreateView />}

        {viewContext.resource === Resources.VolumeAttachments && viewContext.action === ResourceAction.List && <VolumeAttachmentsListView />}
        {viewContext.resource === Resources.VolumeAttachments && viewContext.action === ResourceAction.Details && <VolumeAttachmentsDetailsView />}

        {viewContext.resource === Resources.StorageClasses && viewContext.action === ResourceAction.List && <StorageClassesListView />}
        {viewContext.resource === Resources.StorageClasses && viewContext.action === ResourceAction.Details && <StorageClassesDetailsView />}
        {viewContext.resource === Resources.StorageClasses && viewContext.action === ResourceAction.Create && <StorageClassesCreateView />}

        {viewContext.resource === Resources.CSIDrivers && viewContext.action === ResourceAction.List && <CSIDriversListView />}
        {viewContext.resource === Resources.CSIDrivers && viewContext.action === ResourceAction.Details && <CSIDriversDetailsView />}

        {viewContext.resource === Resources.CSINodes && viewContext.action === ResourceAction.List && <CSINodesListView />}
        {viewContext.resource === Resources.CSINodes && viewContext.action === ResourceAction.Details && <CSINodesDetailsView />}

        {/* Access Control */}
        {viewContext.resource === Resources.ServiceAccounts && viewContext.action === ResourceAction.List && <ServiceAccountsListView />}
        {viewContext.resource === Resources.ServiceAccounts && viewContext.action === ResourceAction.Details && <ServiceAccountsDetailsView />}
        {viewContext.resource === Resources.ServiceAccounts && viewContext.action === ResourceAction.Create && <ServiceAccountsCreateView />}

        {viewContext.resource === Resources.Roles && viewContext.action === ResourceAction.List && <RolesListView />}
        {viewContext.resource === Resources.Roles && viewContext.action === ResourceAction.Details && <RolesDetailsView />}
        {viewContext.resource === Resources.Roles && viewContext.action === ResourceAction.Create && <RolesCreateView />}

        {viewContext.resource === Resources.RoleBindings && viewContext.action === ResourceAction.List && <RoleBindingsListView />}
        {viewContext.resource === Resources.RoleBindings && viewContext.action === ResourceAction.Details && <RoleBindingsDetailsView />}
        {viewContext.resource === Resources.RoleBindings && viewContext.action === ResourceAction.Create && <RoleBindingsCreateView />}

        {viewContext.resource === Resources.ClusterRoles && viewContext.action === ResourceAction.List && <ClusterRolesListView />}
        {viewContext.resource === Resources.ClusterRoles && viewContext.action === ResourceAction.Details && <ClusterRolesDetailsView />}
        {viewContext.resource === Resources.ClusterRoles && viewContext.action === ResourceAction.Create && <ClusterRolesCreateView />}

        {viewContext.resource === Resources.ClusterRoleBindings && viewContext.action === ResourceAction.List && <ClusterRoleBindingsListView />}
        {viewContext.resource === Resources.ClusterRoleBindings && viewContext.action === ResourceAction.Details && <ClusterRoleBindingsDetailsView />}
        {viewContext.resource === Resources.ClusterRoleBindings && viewContext.action === ResourceAction.Create && <ClusterRoleBindingsCreateView />}

        {/* Administration */}
        {viewContext.resource === Resources.PriorityClasses && viewContext.action === ResourceAction.List && <PriorityClassesListView />}
        {viewContext.resource === Resources.PriorityClasses && viewContext.action === ResourceAction.Details && <PriorityClassesDetailsView />}
        {viewContext.resource === Resources.PriorityClasses && viewContext.action === ResourceAction.Create && <PriorityClassesCreateView />}

        {viewContext.resource === Resources.RuntimeClasses && viewContext.action === ResourceAction.List && <RuntimeClassesListView />}
        {viewContext.resource === Resources.RuntimeClasses && viewContext.action === ResourceAction.Details && <RuntimeClassesDetailsView />}
        {viewContext.resource === Resources.RuntimeClasses && viewContext.action === ResourceAction.Create && <RuntimeClassesCreateView />}

        {viewContext.resource === Resources.MutatingWebhookConfigurations && viewContext.action === ResourceAction.List && <MutatingWebhookConfigurationsListView />}
        {viewContext.resource === Resources.MutatingWebhookConfigurations && viewContext.action === ResourceAction.Details && <MutatingWebhookConfigurationsDetailsView />}

        {viewContext.resource === Resources.ValidatingWebhookConfigurations && viewContext.action === ResourceAction.List && <ValidatingWebhookConfigurationsListView />}
        {viewContext.resource === Resources.ValidatingWebhookConfigurations && viewContext.action === ResourceAction.Details && <ValidatingWebhookConfigurationsDetailsView />}

        {/* Operations */}
        {viewContext.resource === Resources.PortForwards && viewContext.action === ResourceAction.List && <PortForwardsListView />}
        {viewContext.resource === Resources.MCPServer && viewContext.action === ResourceAction.List && <MCPServerListView />}
        {viewContext.resource === Resources.MCPServer && viewContext.action === ResourceAction.Details && <MCPServerDetailsView />}

        {/* Settings */}
        {viewContext.resource === Resources.Preferences && viewContext.action === ResourceAction.List && <PreferencesListView />}
      </div>

      <Drawer title={helpTitle} open={drawerOpen} onClose={() => setDrawerOpen(false)}>{helpContent}</Drawer>
    </SidebarLayout>
  )
};
