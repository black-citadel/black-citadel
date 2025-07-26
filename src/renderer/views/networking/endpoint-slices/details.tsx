import { V1EndpointSlice } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { EndpointSliceBadge } from '@components/networking/endpoint-slice/badge';
import { EndpointSliceEndpoints } from '@components/networking/endpoint-slice/endpoint-slice-endpoints';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';
import { ResourceActions } from '@components/resources/ResourceActions';

export const EndpointSlicesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [endpointSlice, setEndpointSlice] = useState<V1EndpointSlice>();
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

  const handleDelete = async () => {
    // TODO: Implement deleteNamespacedEndpointSlice in the main process
    console.warn('Delete EndpointSlice not yet implemented');
    // await window.electronAPI.deleteNamespacedEndpointSlice(viewContext.name, viewContext.namespace);
    // setViewContext({ resource: Resources.EndpointSlices, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.EndpointSlices,
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
            resourceType={Resources.EndpointSlices}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={endpointSlice}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
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

      {activeTab === ResourceTabs.Details && endpointSlice &&
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Address Type">
                {endpointSlice.addressType}
              </DetailsItem>
              <DetailsItem label="Total Endpoints">
                {endpointSlice.endpoints?.length || 0}
              </DetailsItem>
              <DetailsItem label="Total Ports">
                {endpointSlice.ports?.length || 0}
              </DetailsItem>
            </div>
          </Container>

          {endpointSlice.ports && endpointSlice.ports.length > 0 && (
            <Container title="Ports">
              <div className="grid grid-cols-3 gap-4">
                {endpointSlice.ports.map((port, index) => (
                  <DetailsItem key={index} label={port.name || `Port ${index + 1}`}>
                    {port.port} ({port.protocol || 'TCP'})
                  </DetailsItem>
                ))}
              </div>
            </Container>
          )}

          {endpointSlice.endpoints && endpointSlice.endpoints.length > 0 && (
            <Container title="Endpoints">
              <EndpointSliceEndpoints endpoints={endpointSlice.endpoints} />
            </Container>
          )}

          <MetadataDetails metadata={endpointSlice.metadata} />
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};