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
import { ResourceActions } from '@components/resources/ResourceActions';
import { PodDisruptionBudgetDetails } from '@components/gen/V1PodDisruptionBudget/details';

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

  const handleEdit = () => {
    setViewContext({
      resource: Resources.PodDisruptionBudgets,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
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
            onEdit={handleEdit}
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

      {activeTab === ResourceTabs.Details && pdb && <PodDisruptionBudgetDetails resourceData={pdb} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};