import { useEffect, useState } from 'react';
import {
  V1LimitRange,
  V1LimitRangeItem
} from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PanelGrid } from '@components/layout/panel';

export const LimitRangesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [limitRange, setLimitRange] = useState<V1LimitRange>();
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

  const handleEdit = () => {
    setViewContext({
      resource: Resources.LimitRanges,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  const getLimitRangeItems = (item: V1LimitRangeItem) => {
    const items = [];
    
    if (item._default) {
      Object.entries(item._default).forEach(([key, value]) => {
        items.push({
          label: `Default ${key}`,
          value: <span className="text-sm">{value}</span>
        });
      });
    }
    
    if (item.defaultRequest) {
      Object.entries(item.defaultRequest).forEach(([key, value]) => {
        items.push({
          label: `Default Request ${key}`,
          value: <span className="text-sm">{value}</span>
        });
      });
    }
    
    if (item.max) {
      Object.entries(item.max).forEach(([key, value]) => {
        items.push({
          label: `Max ${key}`,
          value: <span className="text-sm">{value}</span>
        });
      });
    }
    
    if (item.min) {
      Object.entries(item.min).forEach(([key, value]) => {
        items.push({
          label: `Min ${key}`,
          value: <span className="text-sm">{value}</span>
        });
      });
    }
    
    if (item.maxLimitRequestRatio) {
      Object.entries(item.maxLimitRequestRatio).forEach(([key, value]) => {
        items.push({
          label: `Max Limit/Request Ratio ${key}`,
          value: <span className="text-sm">{value}</span>
        });
      });
    }
    
    return items;
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
            onEdit={handleEdit}
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
          {limitRange.spec?.limits?.map((item, index) => (
            <PanelGrid
              key={index}
              title={`Limits for ${item.type}`}
              items={getLimitRangeItems(item)}
              columns={2}
            />
          ))}

          <MetadataDetails metadata={limitRange.metadata} />
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};