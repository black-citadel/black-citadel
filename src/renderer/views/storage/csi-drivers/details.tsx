import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CSIDriverBadge } from '@components/storage/csi-driver/badge';
import { VolumeLifecycleModes } from '@components/storage/csi-driver/volume-lifecycle-modes';
import { TokenRequests } from '@components/storage/csi-driver/token-requests';
import { Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';

export const CSIDriversDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [csiDriver, setCSIDriver] = useState<k8s.V1CSIDriver>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readCSIDriver(viewContext.name);
      setCSIDriver(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch CSI driver:", e);
      setError("Failed to fetch CSI driver.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(csiDriver);

  return (
    <>
      <DetailsHeader error={error}><CSIDriverBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && csiDriver && (
        <div className='m-2'>
          <MetadataDetails metadata={csiDriver.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Attach Required">
            {csiDriver.spec.attachRequired?.toString() || 'Not specified'}
          </DetailsItem>
          <DetailsItem label="Pod Info on Mount">
            {csiDriver.spec.podInfoOnMount?.toString() || 'Not specified'}
          </DetailsItem>
          <DetailsItem label="Storage Capacity">
            {csiDriver.spec.storageCapacity?.toString() || 'Not specified'}
          </DetailsItem>
          <DetailsItem label="FS Group Policy">
            {csiDriver.spec.fsGroupPolicy || 'Not specified'}
          </DetailsItem>
          <VolumeLifecycleModes modes={csiDriver.spec.volumeLifecycleModes} />
          <TokenRequests requests={csiDriver.spec.tokenRequests} />
          <DetailsItem label="Requires Volume Attributes">
            {csiDriver.spec.requiresRepublish?.toString() || 'Not specified'}
          </DetailsItem>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};