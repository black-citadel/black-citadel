import { V1ConfigMap } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ConfigMapBadge } from '@components/configuration/config-map/badge';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@components/base/description-list';
import { ResourceActions } from '@components/resources/ResourceActions';

export const ConfigMapsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [configMap, setConfigMap] = useState<V1ConfigMap>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedConfigMap(viewContext.name, viewContext.namespace);
      setConfigMap(data);
      console.log(data);
      setError(null);

    } catch (e) {
      console.error("Failed to fetch services:", e);
      setError("Failed to fetch services.");
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

  const renderConfigMapData = () => {
    if (!configMap || !configMap.data) return "No data";
    return Object.entries(configMap.data).map(([key, value]) => (
      <>
        <DescriptionTerm>{key}</DescriptionTerm>
        <DescriptionDetails><pre className="whitespace-pre-wrap text-xs">{value}</pre></DescriptionDetails>
      </>
    ));
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
          <MetadataDetails metadata={configMap.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DescriptionList>
            {renderConfigMapData()}
          </DescriptionList>
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};