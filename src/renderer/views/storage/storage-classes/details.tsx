import { V1StorageClass } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DetailsItem } from '@components/details-item';
import { StorageClassBadge } from '@components/storage/storage-class/badge';
import { Parameters } from '@components/storage/storage-class/parameters';
import { AllowedTopologies } from '@components/storage/storage-class/allowed-topologies';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';

export const StorageClassesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [storageClass, setStorageClass] = useState<V1StorageClass>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readStorageClass(viewContext.name);
      setStorageClass(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch storage class:", e);
      setError("Failed to fetch storage class.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(storageClass);

  const handleDelete = async () => {
    await window.electronAPI.deleteStorageClass(viewContext.name);
    setViewContext({ resource: Resources.StorageClasses, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.StorageClasses}
            resourceName={viewContext.name}
            resource={storageClass}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <StorageClassBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && storageClass && (
        <div className='m-2'>
          <MetadataDetails metadata={storageClass.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Provisioner">
            {storageClass.provisioner}
          </DetailsItem>
          <DetailsItem label="Reclaim Policy">
            {storageClass.reclaimPolicy || 'Delete'}
          </DetailsItem>
          <DetailsItem label="Volume Binding Mode">
            {storageClass.volumeBindingMode || 'Immediate'}
          </DetailsItem>
          <DetailsItem label="Allow Volume Expansion">
            {storageClass.allowVolumeExpansion?.toString() || 'false'}
          </DetailsItem>
          <Parameters parameters={storageClass.parameters} />
          <AllowedTopologies allowedTopologies={storageClass.allowedTopologies} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};