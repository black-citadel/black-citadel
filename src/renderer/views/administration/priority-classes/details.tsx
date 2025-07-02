import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PriorityClassBadge } from '@components/administration/priority-class/badge';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';

export const PriorityClassesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [priorityClass, setPriorityClass] = useState<k8s.V1PriorityClass>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readPriorityClass(viewContext.name);
      setPriorityClass(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch priority class:", e);
      setError("Failed to fetch priority class.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(priorityClass);

  const handleDelete = async () => {
    await window.electronAPI.deletePriorityClass(viewContext.name);
    setViewContext({ resource: Resources.PriorityClasses, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.PriorityClasses}
            resourceName={viewContext.name}
            resource={priorityClass}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <PriorityClassBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && priorityClass && (
        <div className='m-2'>
          <MetadataDetails metadata={priorityClass.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Value">
            {priorityClass.value}
          </DetailsItem>
          <DetailsItem label="Global Default">
            {priorityClass.globalDefault ? 'Yes' : 'No'}
          </DetailsItem>
          <DetailsItem label="Description">
            {priorityClass.description || 'No description provided'}
          </DetailsItem>
          <DetailsItem label="Preemption Policy">
            {priorityClass.preemptionPolicy || 'PreemptLowerPriority'}
          </DetailsItem>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};