import { V2HorizontalPodAutoscaler } from '@utils/k8s-types';
import { Heading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { MetadataDetails } from '@components/metadata';
import { HorizontalPodAutoscalerBadge } from '@components/configuration/horizontal-pod-autoscaler/badge';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PanelGrid } from '@components/layout/panel';

export const HorizontalPodAutoscalersDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [hpa, setHPA] = useState<V2HorizontalPodAutoscaler>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedHorizontalPodAutoscaler(viewContext.name, viewContext.namespace);
      setHPA(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch HPA:", e);
      setError("Failed to fetch HPA.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(hpa);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedHorizontalPodAutoscaler(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.HorizontalPodAutoscalers, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.HorizontalPodAutoscalers,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  const getConfigurationItems = () => {
    if (!hpa) return [];
    return [
      {
        label: 'Target Reference',
        value: <span className="text-sm">{hpa.spec.scaleTargetRef.kind}/{hpa.spec.scaleTargetRef.name}</span>
      },
      {
        label: 'Min Replicas',
        value: <span className="text-sm">{hpa.spec.minReplicas || 1}</span>
      },
      {
        label: 'Max Replicas',
        value: <span className="text-sm">{hpa.spec.maxReplicas}</span>
      }
    ];
  };

  const getStatusItems = () => {
    if (!hpa || !hpa.status) return [];
    return [
      {
        label: 'Current Replicas',
        value: <span className="text-sm">{hpa.status.currentReplicas || 0}</span>
      },
      {
        label: 'Desired Replicas',
        value: <span className="text-sm">{hpa.status.desiredReplicas || 0}</span>
      }
    ];
  };

  const getMetricsItems = () => {
    if (!hpa || !hpa.spec.metrics) return [];
    return hpa.spec.metrics.map((metric, index) => {
      let value = '';
      if (metric.type === 'Resource' && metric.resource) {
        value = `${metric.resource.name} - Target: ${metric.resource.target.type} ${metric.resource.target.averageUtilization || metric.resource.target.averageValue || metric.resource.target.value}`;
      } else if (metric.type === 'Pods' && metric.pods) {
        value = `${metric.pods.metric.name} - Target: ${metric.pods.target.type} ${metric.pods.target.averageValue || metric.pods.target.value}`;
      } else if (metric.type === 'Object' && metric.object) {
        value = `${metric.object.metric.name} - Target: ${metric.object.target.type} ${metric.object.target.value}`;
      }
      
      return {
        label: `${metric.type} Metric`,
        value: <span className="text-sm">{value}</span>
      };
    });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.HorizontalPodAutoscalers}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={hpa}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <HorizontalPodAutoscalerBadge /> {viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && hpa && (
        <div className='m-2'>
          <PanelGrid
            title="Configuration"
            items={getConfigurationItems()}
            columns={3}
          />

          <PanelGrid
            title="Status"
            items={getStatusItems()}
            columns={2}
          />

          {hpa.spec.metrics && hpa.spec.metrics.length > 0 && (
            <PanelGrid
              title="Metrics"
              items={getMetricsItems()}
              columns={1}
            />
          )}

          <MetadataDetails metadata={hpa.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};