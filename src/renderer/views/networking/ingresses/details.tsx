import k8s = require('@kubernetes/client-node');
import { Heading, Subheading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { IngressBadge } from '@components/networking/ingress/badge';
import { IngressRules } from '@components/networking/ingress/ingress-rules';
import { ResourceActions } from '@components/resources/ResourceActions';

export const IngressesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [ingress, setIngress] = useState<k8s.V1Ingress>();
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

      {activeTab === ResourceTabs.Details && ingress && <>
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={ingress.metadata.name} />
            <DetailsNamespace name={ingress.metadata.namespace} />
            <DetailsLabels labels={ingress.metadata.labels} />
            <DetailsAnnotations annotations={ingress.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Ingress Class">
              {ingress.spec.ingressClassName}
            </DetailsItem>
          </div>
        </div>

        <Subheading className='mt-8'>Rules</Subheading>
        <IngressRules rules={ingress.spec.rules} />
      </>}

      {activeTab === ResourceTabs.YAML && <>
        <Editor content={yamlContent} />
      </>}
    </>
  );
};