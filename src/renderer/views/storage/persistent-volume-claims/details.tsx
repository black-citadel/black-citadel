import { V1PersistentVolumeClaim } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { DetailsItem } from '@components/details-item';
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { VolumeMode } from '@components/storage/persistent-volume-claim/volume-mode';
import { AccessModes } from '@components/storage/persistent-volume-claim/access-modes';
import { StorageDetails } from '@components/storage/persistent-volume-claim/storage-details';
import { PVCStatus } from '@components/storage/persistent-volume-claim/status';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';

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

      {activeTab === ResourceTabs.Details && pvc && (
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Storage Class">
                {pvc.spec.storageClassName || 'Default'}
              </DetailsItem>
              
              <VolumeMode volumeMode={pvc.spec.volumeMode} />
              
              <DetailsItem label="Volume Name">
                {pvc.spec.volumeName || 'Not bound'}
              </DetailsItem>
              
              <AccessModes accessModes={pvc.spec.accessModes} />
              
              <StorageDetails
                requests={pvc.spec.resources?.requests}
                limits={pvc.spec.resources?.limits}
              />
            </div>
          </Container>

          <Container title="Status">
            <PVCStatus status={pvc.status} />
          </Container>

          <MetadataDetails metadata={pvc.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};