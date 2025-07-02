import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { PersistentVolumeBadge } from '@components/storage/persistent-volume/badge';
import { PersistentVolumeSource } from '@components/storage/persistent-volume/source';
import { ClaimRef } from '@components/storage/persistent-volume/claim-ref';
import { PVStatus } from '@components/storage/persistent-volume/status';
import { VolumeMode } from '@components/storage/persistent-volume/volume-mode';
import { AccessModes } from '@components/storage/persistent-volume/access-modes';
import { StorageDetails } from '@components/storage/persistent-volume/storage-details';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';

export const PersistentVolumesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [pv, setPV] = useState<k8s.V1PersistentVolume>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readPersistentVolume(viewContext.name);
      setPV(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch persistent volume:", e);
      setError("Failed to fetch persistent volume.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(pv);

  const handleDelete = async () => {
    await window.electronAPI.deletePersistentVolume(viewContext.name);
    setViewContext({ resource: Resources.PersistentVolumes, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.PersistentVolumes}
            resourceName={viewContext.name}
            resource={persistentVolume}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <PersistentVolumeBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && pv && (
        <div className='m-2'>
          <MetadataDetails metadata={pv.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Storage Class">
            {pv.spec.storageClassName || 'None'}
          </DetailsItem>
          <DetailsItem label="Reclaim Policy">
            {pv.spec.persistentVolumeReclaimPolicy}
          </DetailsItem>
          <VolumeMode volumeMode={pv.spec.volumeMode} />
          <AccessModes accessModes={pv.spec.accessModes} />
          <StorageDetails capacity={pv.spec.capacity} />
          <PersistentVolumeSource source={pv.spec} />
          <ClaimRef claimRef={pv.spec.claimRef} />
          <PVStatus status={pv.status} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};