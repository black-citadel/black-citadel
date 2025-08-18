import { V1PersistentVolumeClaim } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PersistentVolumeClaimDetails } from '@components/gen/V1PersistentVolumeClaim/details';

export const PersistentVolumeClaimsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pvc, setPVC] = useState<V1PersistentVolumeClaim>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedPersistentVolumeClaim(viewContext.name, viewContext.namespace);
      setPVC(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch persistent volume claim:", e);
      setError("Failed to fetch persistent volume claim.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(pvc);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedPersistentVolumeClaim(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.PersistentVolumeClaims, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.PersistentVolumeClaims,
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
            resourceType={Resources.PersistentVolumeClaims}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={pvc}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <PersistentVolumeClaimBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && pvc && <PersistentVolumeClaimDetails resourceData={pvc} />}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};