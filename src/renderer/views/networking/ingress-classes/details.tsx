import { V1IngressClass } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { IngressClassBadge } from '@components/networking/ingress-class/badge';
import { Heading } from '@components/base/heading';

export const IngressClassesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
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

  return (
    <>
      <DetailsHeader error={error}>
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

      {activeTab === ResourceTabs.Details && ingressClass && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={ingressClass.metadata.name} />
            <DetailsLabels labels={ingressClass.metadata.labels} />
            <DetailsAnnotations annotations={ingressClass.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Controller">
              {ingressClass.spec.controller}
            </DetailsItem>
            {ingressClass.spec.parameters && (
              <DetailsItem label="Parameters">
                <div>API Group: {ingressClass.spec.parameters.apiGroup}</div>
                <div>Kind: {ingressClass.spec.parameters.kind}</div>
                <div>Name: {ingressClass.spec.parameters.name}</div>
              </DetailsItem>
            )}
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};