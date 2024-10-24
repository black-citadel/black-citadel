import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { ContextBadge } from '@components/cluster/context/badge';

export const ContextsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [context, setContext] = useState<k8s.Context>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.getContextObject(viewContext.name);
      setContext(data);
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

  const yamlContent = dump(context);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <ContextBadge />{viewContext.name}
        </Heading>
        
        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && context && (
        <div className='m-2'>
          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Cluster">
            {context.cluster || 'Not specified'}
          </DetailsItem>
          <DetailsItem label="User">
            {context.user || 'Not specified'}
          </DetailsItem>
          <DetailsItem label="Namespace">
            {context.namespace || 'Default'}
          </DetailsItem>

          <Subheading className='mt-8 mb-4'>Metadata</Subheading>
          <DetailsItem label="Name">
            {context.name}
          </DetailsItem>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
}
