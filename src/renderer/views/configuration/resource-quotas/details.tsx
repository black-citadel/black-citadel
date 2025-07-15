import React, { useEffect, useState } from 'react';
import { V1ResourceQuota } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DetailsItem } from '@components/details-item';
import { ResourceQuotaBadge } from '@components/configuration/resource-quota/badge';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';

export const ResourceQuotasDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [resourceQuota, setResourceQuota] = useState<V1ResourceQuota>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedResourceQuota(viewContext.name, viewContext.namespace);
      setResourceQuota(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch resource quota:", e);
      setError("Failed to fetch resource quota.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(resourceQuota);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedResourceQuota(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.ResourceQuotas, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.ResourceQuotas}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={resourceQuota}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <ResourceQuotaBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>
      {activeTab === ResourceTabs.Details && resourceQuota && (
        <div className='m-2'>
          <MetadataDetails metadata={resourceQuota.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Quota Spec">
            {renderQuotaSpec(resourceQuota)}
          </DetailsItem>
          <DetailsItem label="Quota Status">
            {renderQuotaStatus(resourceQuota)}
          </DetailsItem>
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};

const renderQuotaSpec = (resourceQuota: V1ResourceQuota) => {
  if (!resourceQuota || !resourceQuota.spec || !resourceQuota.spec.hard) return "No quota specified";
  return Object.entries(resourceQuota.spec.hard).map(([key, value]) => (
    <div key={key} className="mb-2">
      <span className="font-semibold">{key}:</span> {value}
    </div>
  ));
};

const renderQuotaStatus = (resourceQuota: V1ResourceQuota) => {
  if (!resourceQuota || !resourceQuota.status || !resourceQuota.status.hard) return "No status available";
  return Object.entries(resourceQuota.status.hard).map(([key, hardValue]) => {
    const usedValue = resourceQuota.status.used?.[key] || "0";
    return (
      <div key={key} className="mb-2">
        <span className="font-semibold">{key}:</span> {usedValue} / {hardValue}
      </div>
    );
  });
};