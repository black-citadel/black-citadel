import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { EndpointSliceBadge } from '@components/networking/endpoint-slice/badge';
import { EndpointSliceEndpoints } from '@components/networking/endpoint-slice/endpoint-slice-endpoints';
import { Heading } from '@components/base/heading';

export const EndpointSlicesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [endpointSlice, setEndpointSlice] = useState<k8s.V1EndpointSlice>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedEndpointSlice(viewContext.name, viewContext.namespace);
      setEndpointSlice(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch endpoint slice:", e);
      setError("Failed to fetch endpoint slice.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(endpointSlice);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <EndpointSliceBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && endpointSlice && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={endpointSlice.metadata.name} />
            <DetailsNamespace name={endpointSlice.metadata.namespace} />
            <DetailsLabels labels={endpointSlice.metadata.labels} />
            <DetailsAnnotations annotations={endpointSlice.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="AddressType">
              {endpointSlice.addressType}
            </DetailsItem>
            <DetailsItem label="Ports">
              {endpointSlice.ports?.map((port, index) => (
                <div key={index}>
                  {port.port} ({port.protocol})
                </div>
              ))}
            </DetailsItem>
            <DetailsItem label="Endpoints">
              <EndpointSliceEndpoints endpoints={endpointSlice.endpoints} />
            </DetailsItem>
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};