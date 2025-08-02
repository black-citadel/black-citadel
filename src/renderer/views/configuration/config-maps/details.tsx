import { V1ConfigMap } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ConfigMapBadge } from '@components/configuration/config-map/badge';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { ConfigMapDetails } from '@components/configuration/config-map/details';

export const ConfigMapsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [resourceData, setResourceData] = useState<V1ConfigMap>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedConfigMap(viewContext.name, viewContext.namespace);
      setResourceData(data);
      setError(null);

    } catch (e) {
      console.error("Failed to fetch config map:", e);
      setError("Failed to fetch config map.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(resourceData);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedConfigMap(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.ConfigMaps, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.ConfigMaps,
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
            resourceType={Resources.ConfigMaps}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={resourceData}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <ConfigMapBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && resourceData && <ConfigMapDetails resourceData={resourceData} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};