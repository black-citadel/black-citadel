import { V2HorizontalPodAutoscaler } from '@utils/k8s-types';
import { Heading, Subheading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DetailsItem } from '@components/details-item';
import { MetadataDetails } from '@components/metadata';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { ResourceActions } from '@components/resources/ResourceActions';

export const HorizontalPodAutoscalersDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [hpa, setHPA] = useState<V2HorizontalPodAutoscaler>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedHorizontalPodAutoscaler(viewContext.name, viewContext.namespace);
      setHPA(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch HPA:", e);
      setError("Failed to fetch HPA.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(hpa);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedHorizontalPodAutoscaler(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.HorizontalPodAutoscalers, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.HorizontalPodAutoscalers}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={hpa}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <HorizontalPodAutoscalerBadge /> {viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && hpa && (
        <div className='m-2'>
          <MetadataDetails metadata={hpa.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Reference">
            {hpa.spec.scaleTargetRef.kind}/{hpa.spec.scaleTargetRef.name}
          </DetailsItem>
          <DetailsItem label="Min Replicas">
            {hpa.spec.minReplicas}
          </DetailsItem>
          <DetailsItem label="Max Replicas">
            {hpa.spec.maxReplicas}
          </DetailsItem>
          <DetailsItem label="Current Replicas">
            {hpa.status.currentReplicas}
          </DetailsItem>
          <DetailsItem label="Desired Replicas">
            {hpa.status.desiredReplicas}
          </DetailsItem>
          <DetailsItem label="Metrics">
            {hpa.spec.metrics.map((metric, index) => (
              <div key={index}>
                {metric.type}: {metric.resource?.name} -
                Target: {metric.resource?.target.type} {metric.resource?.target.averageUtilization}%
              </div>
            ))}
          </DetailsItem>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};