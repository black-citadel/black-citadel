import { V1IngressClass } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { IngressClassBadge } from '@components/networking/ingress-class/badge';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';
import { ResourceActions } from '@components/resources/ResourceActions';

export const IngressClassesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [ingressClass, setIngressClass] = useState<V1IngressClass>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readIngressClass(viewContext.name);
      setIngressClass(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch ingress class:", e);
      setError("Failed to fetch ingress class.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(ingressClass);

  const handleDelete = async () => {
    await window.electronAPI.deleteIngressClass(viewContext.name);
    setViewContext({ resource: Resources.IngressClasses, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.IngressClasses}
            resourceName={viewContext.name}
            resource={ingressClass}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <IngressClassBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && ingressClass &&
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Controller">
                {ingressClass.spec.controller}
              </DetailsItem>
              {ingressClass.spec.parameters && (
                <>
                  <DetailsItem label="Parameter API Group">
                    {ingressClass.spec.parameters.apiGroup || 'None'}
                  </DetailsItem>
                  <DetailsItem label="Parameter Kind">
                    {ingressClass.spec.parameters.kind}
                  </DetailsItem>
                  <DetailsItem label="Parameter Name">
                    {ingressClass.spec.parameters.name}
                  </DetailsItem>
                </>
              )}
            </div>
          </Container>

          <MetadataDetails metadata={ingressClass.metadata} />
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};