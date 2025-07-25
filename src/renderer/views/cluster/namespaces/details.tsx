import { useState, useEffect } from 'react';
import {
  V1Namespace,
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { MetadataDetails } from '@components/metadata';
import { Heading } from '@components/base/heading';
import { formatStatus } from '@components/cluster/namespace/helpers';
import { Editor } from '@components/editor';
import helpObjects from '@help/index';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

export const NamespacesDetailsView = (): JSX.Element => {
  // Debug imports
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [namespace, setNamespace] = useState<V1Namespace>();
  const [error, setError] = useState<string | null>(null);


  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespace(viewContext.name);
      setNamespace(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch namespace:", e);
      setError("Failed to fetch namespace.");
    }
  };


  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [viewContext.name]);

  const yamlContent = dump(namespace);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespace(viewContext.name);
    setViewContext({ resource: Resources.Namespaces, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({ 
      resource: Resources.Namespaces, 
      action: ResourceAction.Edit, 
      name: viewContext.name 
    });
  };

  return (
    <>
      <DetailsHeader
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.Namespaces}
            resourceName={viewContext.name}
            resource={namespace}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <NamespaceBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && namespace && (
        <div className='m-2' key={viewContext.name}>
          <Container title="Status">
            <DetailsItem label="Phase" help={helpObjects.namespace.status}>
              {formatStatus(namespace.status?.phase)}
            </DetailsItem>
          </Container>

          <MetadataDetails metadata={namespace.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};