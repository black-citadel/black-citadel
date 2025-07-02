import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RuntimeClassBadge } from '@components/administration/runtime-class/badge';
import { Overhead } from '@components/administration/runtime-class/overhead';
import { Scheduling } from '@components/administration/runtime-class/scheduling';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';

export const RuntimeClassesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [runtimeClass, setRuntimeClass] = useState<k8s.V1RuntimeClass>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readRuntimeClass(viewContext.name);
      setRuntimeClass(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch runtime class:", e);
      setError("Failed to fetch runtime class.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(runtimeClass);

  const handleDelete = async () => {
    await window.electronAPI.deleteRuntimeClass(viewContext.name);
    setViewContext({ resource: Resources.RuntimeClasses, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.RuntimeClasses}
            resourceName={viewContext.name}
            resource={runtimeClass}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <RuntimeClassBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && runtimeClass && (
        <div className='m-2'>
          <MetadataDetails metadata={runtimeClass.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Handler">
            {runtimeClass.handler}
          </DetailsItem>
          <Overhead overhead={runtimeClass.overhead} />
          <Scheduling scheduling={runtimeClass.scheduling} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};