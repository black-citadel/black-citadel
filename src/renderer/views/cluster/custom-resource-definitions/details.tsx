import { useEffect, useState } from 'react';
import { V1CustomResourceDefinition } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ListTable } from '@components/list-table';
import { CustomResourceDefinitionBadge } from '@components/cluster/custom-resource-definition/badge';
import { CustomResourceLink } from '@components/cluster/custom-resource/resource-link';
import { calculateAge } from '@utils/helpers';

enum CustomResourceTabs {
  Details = 'Details',
  Instances = 'Instances',
  YAML = 'YAML'
}

export const CustomResourceDefinitionsDetailsView = (): JSX.Element => {
    const { viewContext } = useView()
    const [activeTab, setActiveTab] = useState<CustomResourceTabs>(CustomResourceTabs.Details)
    const [crd, setCrd] = useState<V1CustomResourceDefinition>();
    const [customResources, setCustomResources] = useState<any[]>([]);
    const [customResourcesError, setCustomResourcesError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = async () => {
      try {
        const data = await window.electronAPI.readCustomResourceDefinition(viewContext.name);
        setCrd(data);
        setError(null);
        
        // Fetch custom resources when we have the CRD data
        if (data?.spec?.group && data?.spec?.names?.plural) {
          fetchCustomResources(data.spec.group, data.spec.names.plural, data);
        }
      } catch (e) {
        console.error("Failed to fetch Custom Resource Definition data:", e);
        setError("Failed to fetch Custom Resource Definition data.");
      }
    };
    
    const fetchCustomResources = async (group: string, plural: string, crdData: V1CustomResourceDefinition) => {
      try {
        // Get the preferred version from the passed CRD data
        const preferredVersion = crdData.spec?.versions?.find(v => v.storage)?.name || crdData.spec?.versions?.[0]?.name;
        if (!preferredVersion) {
          console.error("No version found for CRD");
          return;
        }
        
        console.log('Fetching custom resources:', { group, version: preferredVersion, plural });
        const data = await window.electronAPI.listCustomResources(group, preferredVersion, plural);
        console.log('Custom resources data:', data);
        setCustomResources(data.items || []);
        setCustomResourcesError(null);
      } catch (e) {
        console.error("Failed to fetch custom resources:", e);
        setCustomResourcesError("Failed to fetch custom resources.");
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
              <NavbarItem onClick={() => setActiveTab(CustomResourceTabs.Details)} current={activeTab === CustomResourceTabs.Details}>{CustomResourceTabs.Details}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(CustomResourceTabs.Instances)} current={activeTab === CustomResourceTabs.Instances}>{CustomResourceTabs.Instances}</NavbarItem>
              <NavbarItem onClick={() => setActiveTab(CustomResourceTabs.YAML)} current={activeTab === CustomResourceTabs.YAML}>{CustomResourceTabs.YAML}</NavbarItem>
            </NavbarSection>
          </Navbar>
        </DetailsHeader>
  
        {activeTab === CustomResourceTabs.Details && crd && (
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
  
        {activeTab === CustomResourceTabs.Instances && (
          <div className='m-2'>
            {customResourcesError ? (
              <div className='text-red-600'>{customResourcesError}</div>
            ) : customResources.length === 0 ? (
              <div className='text-gray-500'>No instances found</div>
            ) : (
              <ListTable
                headers={['Name', 'Namespace', 'Age']}
                rows={customResources.map(resource => {
                  const isNamespaced = crd?.spec?.scope === 'Namespaced';
                  const group = crd?.spec?.group || '';
                  const plural = crd?.spec?.names?.plural || '';
                  const version = crd?.spec?.versions?.find(v => v.storage)?.name || crd?.spec?.versions?.[0]?.name || '';
                  const kind = crd?.spec?.names?.kind || '';
                  
                  return {
                    Name: (
                      <CustomResourceLink
                        name={resource.metadata?.name || 'Unknown'}
                        namespace={isNamespaced ? resource.metadata?.namespace : undefined}
                        group={group}
                        version={version}
                        plural={plural}
                        kind={kind}
                      />
                    ),
                    Namespace: isNamespaced ? (resource.metadata?.namespace || 'default') : '-',
                    Age: calculateAge(resource.metadata?.creationTimestamp)
                  };
                })}
              />
            )}
          </div>
        )}

        {activeTab === CustomResourceTabs.YAML && <Editor content={yamlContent} />}
      </>
    );
}

export default CustomResourceDefinitionsDetailsView;