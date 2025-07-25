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
import { Badge, Status } from '@protoku/design-system';
import { Container } from '@components/base/container';
import { calculateAge } from '@utils/helpers';

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
              <Container title="Specification">
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
              </Container>
            )}

            {customResource.status && (
              <>
                {customResource.status.conditions && Array.isArray(customResource.status.conditions) && (
                  <Container title="Conditions">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-800">
                            <th className="text-left font-medium text-zinc-400 py-2 pr-4">Condition</th>
                            <th className="text-left font-medium text-zinc-400 py-2 pr-4">Status</th>
                            <th className="text-left font-medium text-zinc-400 py-2 pr-4">Last Transition</th>
                            <th className="text-left font-medium text-zinc-400 py-2 pr-4">Last Update</th>
                            <th className="text-left font-medium text-zinc-400 py-2">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customResource.status.conditions.map((condition: any, index: number) => (
                            <tr key={index} className="border-b border-neutral-800 last:border-0">
                              <td className="py-2 pr-4">{condition.type}</td>
                              <td className="py-2 pr-4">
                                <Status variant={condition.status === 'True' ? 'success' : 'default'}>
                                  {condition.status}
                                </Status>
                              </td>
                              <td className="py-2 pr-4 text-zinc-500">
                                {condition.lastTransitionTime ? calculateAge(new Date(condition.lastTransitionTime)) : '-'}
                              </td>
                              <td className="py-2 pr-4 text-zinc-500">
                                {condition.lastUpdateTime ? calculateAge(new Date(condition.lastUpdateTime)) : '-'}
                              </td>
                              <td className="py-2 text-zinc-500">
                                {condition.reason || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Container>
                )}
                
                {/* Other status fields */}
                {Object.entries(customResource.status).length > 0 && (
                  <Container title='Status'>
                    {Object.entries(customResource.status).map(([key, value]) => {
                      // Skip conditions as they are displayed separately
                      if (key === 'conditions') return null;
                      
                      return (
                        <DetailsItem key={key} label={key}>
                          {typeof value === 'object' ? (
                            <pre className="text-xs p-2 rounded overflow-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            String(value)
                          )}
                        </DetailsItem>
                      );
                    })}
                  </Container>
                )}
              </>
            )}


            <MetadataDetails metadata={customResource.metadata} />
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}

export default CustomResourceDetailsView;