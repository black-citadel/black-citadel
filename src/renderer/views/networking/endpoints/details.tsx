import { V1Endpoints } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { EndpointBadge } from '@components/networking/endpoint/badge';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';
import { ResourceActions } from '@components/resources/ResourceActions';
import { EndpointSubsets } from '@components/networking/endpoint/endpoint-subsets';
import { DetailsItem } from '@components/details-item';

export const EndpointsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [endpoints, setEndpoints] = useState<V1Endpoints>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedEndpoints(viewContext.name, viewContext.namespace);
      setEndpoints(data as V1Endpoints);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch endpoints:", e);
      setError("Failed to fetch endpoints.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(endpoints);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedEndpoints(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Endpoints, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.Endpoints,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  const countEndpoints = () => {
    if (!endpoints?.subsets) return 0;
    return endpoints.subsets.reduce((total, subset) => {
      const addressCount = (subset.addresses?.length || 0) + (subset.notReadyAddresses?.length || 0);
      const portCount = subset.ports?.length || 1;
      return total + (addressCount * portCount);
    }, 0);
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.Endpoints}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={endpoints}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <EndpointBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && endpoints &&
        <div className='m-2'>
          <Container title="Summary">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Total Endpoints">
                {countEndpoints()}
              </DetailsItem>
              <DetailsItem label="Subsets">
                {endpoints.subsets?.length || 0}
              </DetailsItem>
              <DetailsItem label="Ready Addresses">
                {endpoints.subsets?.reduce((total, subset) => total + (subset.addresses?.length || 0), 0) || 0}
              </DetailsItem>
            </div>
          </Container>

          {endpoints.subsets && endpoints.subsets.length > 0 && (
            <Container title="Endpoint Subsets">
              <EndpointSubsets subsets={endpoints.subsets} />
            </Container>
          )}

          <MetadataDetails metadata={endpoints.metadata} />
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};