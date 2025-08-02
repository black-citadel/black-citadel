import { V2HorizontalPodAutoscaler } from '@utils/k8s-types';
import { Heading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { ResourceActions } from '@components/resources/ResourceActions';
import { HorizontalPodAutoscalerDetails } from '@components/gen/V2HorizontalPodAutoscaler/details';

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

  const handleEdit = () => {
    setViewContext({
      resource: Resources.HorizontalPodAutoscalers,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
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
            onEdit={handleEdit}
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

      {activeTab === ResourceTabs.Details && hpa && <HorizontalPodAutoscalerDetails resourceData={hpa} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};