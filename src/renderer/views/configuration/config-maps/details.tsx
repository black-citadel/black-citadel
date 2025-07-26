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
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PanelGrid } from '@components/layout/panel';

export const ConfigMapsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [configMap, setConfigMap] = useState<V1ConfigMap>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedConfigMap(viewContext.name, viewContext.namespace);
      setConfigMap(data);
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

  const yamlContent = dump(configMap);

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

  const getConfigMapDataItems = () => {
    if (!configMap || !configMap.data) return [];
    return Object.entries(configMap.data).map(([key, value]) => ({
      label: key,
      value: <pre className="whitespace-pre-wrap text-xs break-all overflow-hidden">{value}</pre>
    }));
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
            resource={configMap}
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
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && configMap && (
        <div className='m-2'>
          <PanelGrid
            title="Configuration Data"
            items={getConfigMapDataItems()}
            columns={1}
          />

          <MetadataDetails metadata={configMap.metadata} />
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};