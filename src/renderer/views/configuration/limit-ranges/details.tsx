import React, { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';

export const LimitRangesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [limitRange, setLimitRange] = useState<k8s.V1LimitRange>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedLimitRange(viewContext.name, viewContext.namespace);
      setLimitRange(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch limit range:", e);
      setError("Failed to fetch limit range.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(limitRange);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedLimitRange(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.LimitRanges, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.LimitRanges}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={limitRange}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <LimitRangeBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>
      {activeTab === ResourceTabs.Details && limitRange && (
        <div className='m-2'>
        <MetadataDetails metadata={limitRange.metadata} />

        <Subheading className='mt-8 mb-4'>Configuration</Subheading>
            <DetailsItem label="Limit Range Spec">
              {renderLimitRangeSpec(limitRange)}
            </DetailsItem>
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};

const renderLimitRangeItem = (item: k8s.V1LimitRangeItem) => {
  return (
    <div className="mb-4 p-2">
      <div className="font-semibold mb-2">Type: {item.type}</div>
      {item._default && (
        <div className="mb-2">
          <div className="font-medium">Default:</div>
          {Object.entries(item._default).map(([key, value]) => (
            <div key={key} className="ml-2">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      {item.defaultRequest && (
        <div className="mb-2">
          <div className="font-medium">Default Request:</div>
          {Object.entries(item.defaultRequest).map(([key, value]) => (
            <div key={key} className="ml-2">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      {item.max && (
        <div className="mb-2">
          <div className="font-medium">Max:</div>
          {Object.entries(item.max).map(([key, value]) => (
            <div key={key} className="ml-2">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      {item.min && (
        <div className="mb-2">
          <div className="font-medium">Min:</div>
          {Object.entries(item.min).map(([key, value]) => (
            <div key={key} className="ml-2">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      {item.maxLimitRequestRatio && (
        <div className="mb-2">
          <div className="font-medium">Max Limit/Request Ratio:</div>
          {Object.entries(item.maxLimitRequestRatio).map(([key, value]) => (
            <div key={key} className="ml-2">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderLimitRangeSpec = (limitRange: k8s.V1LimitRange) => {
  if (!limitRange || !limitRange.spec || !limitRange.spec.limits) return "No limits specified";
  return limitRange.spec.limits.map((item, index) => (
    <React.Fragment key={index}>
      {renderLimitRangeItem(item)}
    </React.Fragment>
  ));
};