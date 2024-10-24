import k8s = require('@kubernetes/client-node');
import { Heading, Subheading } from "@components/base/heading";
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceAction, Resources, ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace, DetailsSelector } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { MetadataDetails } from '@components/metadata';

export const PodDisruptionBudgetsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pdb, setPDB] = useState<k8s.V1PodDisruptionBudget>();
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

  return (
    <>
      <DetailsHeader error={error}><PodDisruptionBudgetBadge /> {viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && pdb && (
        <div className='m-2'>
          <MetadataDetails metadata={pdb.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsSelector labels={pdb.spec.selector?.matchLabels} />

          <DetailsItem label="Max Unavailable">
            {pdb.spec.maxUnavailable}
          </DetailsItem>

          <DetailsItem label="Min Available">
            {pdb.spec.minAvailable}
          </DetailsItem>

          <DetailsItem label="Current Healthy">
            {pdb.status?.currentHealthy}
          </DetailsItem>

          <DetailsItem label="Desired Healthy">
            {pdb.status?.desiredHealthy}
          </DetailsItem>

          <DetailsItem label="Expected Pods">
            {pdb.status?.expectedPods}
          </DetailsItem>

          <DetailsItem label="Disruptions Allowed">
            {pdb.status?.disruptionsAllowed}
          </DetailsItem>

          <DetailsItem label="Disruptions Observed">
            {pdb.status?.observedGeneration}
          </DetailsItem>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};