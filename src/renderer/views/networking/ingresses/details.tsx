import { V1Ingress } from '@utils/k8s-types';
import { Heading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { IngressBadge } from '@components/networking/ingress/badge';
import { ResourceActions } from '@components/resources/ResourceActions';
import { IngressDetails } from '@components/gen/V1Ingress/details';

export const IngressesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [ingress, setIngress] = useState<V1Ingress>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedIngress(viewContext.name, viewContext.namespace);
      setIngress(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch ingress:", e);
      setError("Failed to fetch ingress.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(ingress);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedIngress(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Ingresses, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.Ingresses,
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
            resourceType={Resources.Ingresses}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={ingress}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <IngressBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && ingress && <IngressDetails resourceData={ingress} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};