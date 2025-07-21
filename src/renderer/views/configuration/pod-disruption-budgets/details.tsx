import { V1PodDisruptionBudget } from '@utils/k8s-types';
import { Heading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PanelGrid } from '@components/layout/panel';

export const PodDisruptionBudgetsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pdb, setPDB] = useState<V1PodDisruptionBudget>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedPodDisruptionBudget(viewContext.name, viewContext.namespace);
      setPDB(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch PDB:", e);
      setError("Failed to fetch PodDisruptionBudget.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(pdb);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedPodDisruptionBudget(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.PodDisruptionBudgets, action: ResourceAction.List });
  };

  const getConfigurationItems = () => {
    if (!pdb) return [];
    const items = [];
    
    // Add selector
    if (pdb.spec.selector?.matchLabels) {
      const selectorString = Object.entries(pdb.spec.selector.matchLabels)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      items.push({
        label: 'Selector',
        value: <span className="text-sm">{selectorString}</span>
      });
    }
    
    // Add min available
    if (pdb.spec.minAvailable !== undefined) {
      items.push({
        label: 'Min Available',
        value: <span className="text-sm">{pdb.spec.minAvailable}</span>
      });
    }
    
    // Add max unavailable
    if (pdb.spec.maxUnavailable !== undefined) {
      items.push({
        label: 'Max Unavailable',
        value: <span className="text-sm">{pdb.spec.maxUnavailable}</span>
      });
    }
    
    return items;
  };

  const getStatusItems = () => {
    if (!pdb || !pdb.status) return [];
    return [
      {
        label: 'Current Healthy',
        value: <span className="text-sm">{pdb.status.currentHealthy || 0}</span>
      },
      {
        label: 'Desired Healthy',
        value: <span className="text-sm">{pdb.status.desiredHealthy || 0}</span>
      },
      {
        label: 'Expected Pods',
        value: <span className="text-sm">{pdb.status.expectedPods || 0}</span>
      },
      {
        label: 'Disruptions Allowed',
        value: <span className="text-sm">{pdb.status.disruptionsAllowed || 0}</span>
      },
      {
        label: 'Observed Generation',
        value: <span className="text-sm">{pdb.status.observedGeneration || 0}</span>
      }
    ].filter(item => item.value !== undefined);
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.PodDisruptionBudgets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={pdb}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <PodDisruptionBudgetBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && pdb && (
        <div className='m-2'>
          <PanelGrid
            title="Configuration"
            items={getConfigurationItems()}
            columns={2}
          />

          {pdb.status && (
            <PanelGrid
              title="Status"
              items={getStatusItems()}
              columns={3}
            />
          )}

          <MetadataDetails metadata={pdb.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};