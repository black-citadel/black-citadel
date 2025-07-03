import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DeploymentBadge } from '@components/workloads/deployment/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { DeploymentStrategy } from '@components/workloads/deployment/strategy';
import { DeploymentStatus } from '@components/workloads/deployment/status';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { DeploymentSpec } from '@components/workloads/deployment/spec';
import { Badge } from '@components/base/badge';
import { PodList } from '@components/workloads/pod/table';
import { WorkloadLogs } from '@components/workloads/workload-logs';
import { ResourceActions } from '@components/resources/ResourceActions';
import { ScaleAction } from '@components/resources/ResourceActions/actions/ScaleAction';
import type { V1Deployment, V1PodList } from '@utils/k8s-types';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const DeploymentsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [deployment, setDeployment] = useState<V1Deployment>();
  const [pods, setPods] = useState<V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedDeployment(viewContext.name, viewContext.namespace);
      setDeployment(data);
      setError(null);

      const data2 = await window.electronAPI.listNamespacedPod(data.metadata.namespace, undefined, undefined, undefined, undefined, getLabelSelectorString(data.spec.selector.matchLabels));
      setPods(data2);
    } catch (e) {
      console.error("Failed to fetch deployment:", e);
      setError("Failed to fetch deployment.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(deployment);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedDeployment(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Deployments, action: ResourceAction.List });
  };

  const handleScale = async (replicas: number) => {
    const scalePatch = {
      spec: {
        replicas: replicas
      }
    };
    await window.electronAPI.patchNamespacedDeployment(viewContext.name, viewContext.namespace, scalePatch);
    await fetchData();
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <div className="flex items-center gap-2">
            {deployment && (
              <ScaleAction
                resourceName={viewContext.name}
                namespace={viewContext.namespace}
                currentReplicas={deployment.spec?.replicas || 0}
                onScale={handleScale}
              />
            )}
            <ResourceActions
              resourceType={Resources.Deployments}
              resourceName={viewContext.name}
              namespace={viewContext.namespace}
              resource={deployment}
              onDelete={handleDelete}
            />
          </div>
        }
      >
        <Heading>
          <DeploymentBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Logs)} current={activeTab == ResourceTabs.Logs}>{ResourceTabs.Logs}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && deployment && (
        <div className='m-2'>
          <MetadataDetails metadata={deployment.metadata} />

          <DeploymentSpec spec={deployment.spec} />

          <Subheading className='mt-8'>Pods</Subheading>
          {pods && <PodList pods={pods} />}

          <DeploymentStatus status={deployment.status} />
        </div>

      )}

      {activeTab === ResourceTabs.Logs && deployment && pods && (
        <div className='m-2'>
          <WorkloadLogs
            pods={pods.items || []}
            namespace={deployment.metadata.namespace}
          />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};