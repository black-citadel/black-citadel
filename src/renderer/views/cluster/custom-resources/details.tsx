import { useEffect, useState } from 'react';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Badge } from '@protoku/design-system';
import { Container } from '@components/base/container';

export const CustomResourceDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [customResource, setCustomResource] = useState<any>();
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = async () => {
      try {
        console.log('Custom Resource View Context:', viewContext);
        const { group, version, plural } = viewContext.customResource || {};
        if (!group || !version || !plural) {
          console.error('Missing custom resource info:', { group, version, plural });
          throw new Error("Missing custom resource information");
        }
        
        console.log('Fetching custom resource:', { group, version, plural, name: viewContext.name, namespace: viewContext.namespace });
        const data = await window.electronAPI.readCustomResource(
          group,
          version,
          plural,
          viewContext.name,
          viewContext.namespace
        );
        console.log('Custom resource data received:', data);
        setCustomResource(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch custom resource data:", e);
        setError("Failed to fetch custom resource data.");
      }
    };
  
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);
  
    const yamlContent = customResource ? dump(customResource) : '';
    const kind = viewContext.customResource?.kind || 'CustomResource';
    const crdName = viewContext.customResource?.plural && viewContext.customResource?.group 
      ? `${viewContext.customResource.plural}.${viewContext.customResource.group}`
      : kind.toLowerCase();
  
    return (
      <>
        <DetailsHeader error={error}>
          <Heading>
            <Badge variant="gray">{crdName}</Badge> {viewContext.name}
          </Heading>
          
          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === ResourceTabs.Details && customResource && (
          <div className='m-2'>
            
            
            {customResource.spec && (
              <div>
                <Subheading>Specification</Subheading>
                <div className='mt-4 space-y-2'>
                  {Object.entries(customResource.spec).map(([key, value]) => (
                    <DetailsItem key={key} label={key}>
                      {typeof value === 'object' ? (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value)
                      )}
                    </DetailsItem>
                  ))}
                </div>
              </div>
            )}

            {customResource.status && (
              <Container title='Status'>
                  {Object.entries(customResource.status).map(([key, value]) => (
                    <DetailsItem key={key} label={key}>
                      {typeof value === 'object' ? (
                        <pre className="text-xs p-2 rounded overflow-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value)
                      )}
                    </DetailsItem>
                  ))}
              </Container>
            )}


            <MetadataDetails metadata={customResource.metadata} />
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}

export default CustomResourceDetailsView;