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
import { MetadataDetails } from '@components/metadata';
import { ListTable } from '@components/list-table';
import { CustomResourceDefinitionBadge } from '@components/cluster/custom-resource-definition/badge';

export const CustomResourceDefinitionsDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
    const [crd, setCrd] = useState<k8s.V1CustomResourceDefinition>();
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readCustomResourceDefinition(viewContext.name);
        setCrd(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch Custom Resource Definition data:", e);
        setError("Failed to fetch Custom Resource Definition data.");
      }
    };
  
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);
  
    const yamlContent = dump(crd);
  
    return (
      <>
        <DetailsHeader error={error}>
          <Heading>
            <CustomResourceDefinitionBadge />{viewContext.name}
          </Heading>
          
          <Navbar>
            <NavbarSection>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab === ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab === ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === ResourceTabs.Details && crd && (
          <div className='m-2 flex flex-col gap-8'>
            <MetadataDetails metadata={crd.metadata} />
            
            <div>
              <Subheading>Specification</Subheading>
              <div className='mt-4'>
                <DetailsItem label="Group">
                  {crd.spec?.group || 'Not specified'}
                </DetailsItem>
                <DetailsItem label="Scope">
                  {crd.spec?.scope || 'Not specified'}
                </DetailsItem>
                <DetailsItem label="Names">
                  <div className='space-y-1'>
                    <div>Kind: {crd.spec?.names?.kind || 'Not specified'}</div>
                    <div>Plural: {crd.spec?.names?.plural || 'Not specified'}</div>
                    <div>Singular: {crd.spec?.names?.singular || 'Not specified'}</div>
                    {crd.spec?.names?.shortNames && crd.spec.names.shortNames.length > 0 && (
                      <div>Short Names: {crd.spec.names.shortNames.join(', ')}</div>
                    )}
                  </div>
                </DetailsItem>
              </div>
            </div>

            {crd.spec?.versions && crd.spec.versions.length > 0 && (
              <div>
                <Subheading>Versions</Subheading>
                <div className='mt-4'>
                  <ListTable
                    headers={['Name', 'Served', 'Storage', 'Deprecated']}
                    rows={crd.spec.versions.map(version => ({
                      Name: version.name || '',
                      Served: version.served ? 'Yes' : 'No',
                      Storage: version.storage ? 'Yes' : 'No',
                      Deprecated: version.deprecated ? 'Yes' : 'No'
                    }))}
                  />
                </div>
              </div>
            )}

            {crd.status && (
              <div>
                <Subheading>Status</Subheading>
                <div className='mt-4'>
                  {crd.status.conditions?.map((condition, index) => (
                    <DetailsItem key={index} label={condition.type || ''}>
                      <span className={condition.status === 'True' ? 'text-green-600' : 'text-red-600'}>
                        {condition.status || 'Unknown'}
                      </span>
                      {condition.reason && <span className='ml-2 text-gray-600'>({condition.reason})</span>}
                    </DetailsItem>
                  ))}
                  {crd.status.storedVersions && crd.status.storedVersions.length > 0 && (
                    <DetailsItem label="Stored Versions">
                      {crd.status.storedVersions.join(', ')}
                    </DetailsItem>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
  
        {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}

export default CustomResourceDefinitionsDetailsView;