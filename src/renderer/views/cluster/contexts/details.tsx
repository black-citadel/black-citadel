import { useEffect, useState } from 'react';
import { Context } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading } from '@components/base/heading';
import { ContextBadge } from '@components/cluster/context/badge';
import { Container } from '@components/base/container';
import { Button } from '@protoku-bv/design-system';

export const ContextsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [context, setContext] = useState<Context>();
  const [currentContext, setCurrentContext] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [contextData, current] = await Promise.all([
        window.electronAPI.getContextObject(viewContext.name),
        window.electronAPI.getCurrentContext()
      ]);
      setContext(contextData);
      setCurrentContext(current);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch context:", e);
      setError("Failed to fetch context.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(context);

  const handleSetContext = async () => {
    try {
      await window.electronAPI.setCurrentContext(viewContext.name);
      await fetchData();
    } catch (e) {
      console.error("Failed to set context:", e);
    }
  };

  const isCurrentContext = currentContext === viewContext.name;

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <div className="flex items-center gap-2">
            {isCurrentContext ? (
              <span className="text-sm text-green-600 font-medium">Current Context</span>
            ) : (
              <Button variant="secondary" onClick={handleSetContext}>
                Set as Current
              </Button>
            )}
          </div>
        }
      >
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
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Cluster">
                {context.cluster || 'Not specified'}
              </DetailsItem>
              <DetailsItem label="User">
                {context.user || 'Not specified'}
              </DetailsItem>
              <DetailsItem label="Namespace">
                {context.namespace || 'default'}
              </DetailsItem>
            </div>
          </Container>

          <Container title="Context Information">
            <div className="grid grid-cols-2 gap-4">
              <DetailsItem label="Name">
                {context.name}
              </DetailsItem>
              <DetailsItem label="Status">
                {isCurrentContext ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-zinc-500">Inactive</span>
                )}
              </DetailsItem>
            </div>
          </Container>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
}
