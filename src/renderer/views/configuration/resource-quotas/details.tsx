import { useEffect, useState } from 'react';
import { V1ResourceQuota } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ResourceQuotaBadge } from '@components/configuration/resource-quota/badge';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { ResourceQuotaDetails } from '@components/gen/V1ResourceQuota/details';

export const ResourceQuotasDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [resourceQuota, setResourceQuota] = useState<V1ResourceQuota>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedResourceQuota(viewContext.name, viewContext.namespace);
      setResourceQuota(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch resource quota:", e);
      setError("Failed to fetch resource quota.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(resourceQuota);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedResourceQuota(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.ResourceQuotas, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.ResourceQuotas,
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
            resourceType={Resources.ResourceQuotas}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={resourceQuota}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <ResourceQuotaBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && resourceQuota && <ResourceQuotaDetails resourceData={resourceQuota} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};