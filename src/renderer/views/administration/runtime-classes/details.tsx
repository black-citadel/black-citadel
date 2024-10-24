import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RuntimeClassBadge } from '@components/administration/runtime-class/badge';
import { Overhead } from '@components/administration/runtime-class/overhead';
import { Scheduling } from '@components/administration/runtime-class/scheduling';
import { MetadataDetails } from '@components/metadata';
import { Subheading } from '@components/base/heading';

export const RuntimeClassesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
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

  return (
    <>
      <DetailsHeader error={error}><RuntimeClassBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

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