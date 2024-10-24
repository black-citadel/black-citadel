import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { formatStatus } from '@components/cluster/namespace/helpers';
import { CodePanel } from '@components/code';
import helpObjects from '@help/helpObjects';

export const NamespacesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [namespace, setNamespace] = useState<k8s.V1Namespace>();
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
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(namespace);


  const handleDelete = async () => {
    await window.electronAPI.deleteNamespace(viewContext.name);

    setViewContext({ resource: Resources.Namespaces, action: ResourceAction.List });

  };

  return (
    <>
      <DetailsHeader error={error} onDelete={handleDelete}>
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
        <div className='m-2'>
          <MetadataDetails metadata={namespace.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Phase" help={helpObjects.namespace.status}>
            {formatStatus(namespace.status?.phase)}
          </DetailsItem>

        </div>
      )}

      {activeTab === ResourceTabs.YAML && <CodePanel code={yamlContent}><code>{yamlContent}</code></CodePanel>}
    </>
  );
};