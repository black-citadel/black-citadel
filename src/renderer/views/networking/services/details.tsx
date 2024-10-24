import k8s = require('@kubernetes/client-node');
import { Heading, Subheading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { ServicePorts } from '@components/networking/service/service-ports';
import { ServiceBadge } from '@components/networking/service/badge';
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace, DetailsSelector } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { PodList } from '@components/workloads/pod/table';
import { DetailsHeader } from '@components/details-header';
import { MetadataDetails } from '@components/metadata';

function getLabelSelectorString(selector: { [key: string]: string }): string {
  return Object.keys(selector)
    .map((key) => `${key}=${selector[key]}`)
    .join(',');
}

export const ServicesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [service, setService] = useState<k8s.V1Service>();
  const [pods, setPods] = useState<k8s.V1PodList>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedService(viewContext.name, viewContext.namespace);
      setService(data);
      setError(null);

      const data2 = await window.electronAPI.listNamespacedPod(data.metadata.namespace, undefined, undefined, undefined, undefined, getLabelSelectorString(data.spec.selector));
      setPods(data2);

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

  const yamlContent = dump(service);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <ServiceBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && service &&
        <div className='m-2'>
          <MetadataDetails metadata={service.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <div className="grid grid-cols-3 gap-4">
            <DetailsSelector labels={service.spec.selector} />

            <DetailsItem label="Type">
              {service.spec.type}
            </DetailsItem>

            <DetailsItem label="Cluster IP">
              {service.spec.clusterIP}
            </DetailsItem>
          </div>

          <Subheading className='mt-8 mb-4'>Ports</Subheading>
          <ServicePorts ports={service.spec.ports} />

          <Subheading className='mt-8 mb-4'>Pods</Subheading>
          {pods && <PodList pods={pods} />}
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};