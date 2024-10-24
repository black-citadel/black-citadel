import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { CSINodeBadge } from '@components/storage/csi-node/badge';
import { CSIDriversList } from '@components/storage/csi-node/csi-drivers-list';
import { Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';

export const CSINodesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [csiNode, setCSINode] = useState<k8s.V1CSINode>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readCSINode(viewContext.name);
      setCSINode(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch CSI node:", e);
      setError("Failed to fetch CSI node.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(csiNode);

  return (
    <>
      <DetailsHeader error={error}><CSINodeBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && csiNode && (
        <div className='m-2'>
          <MetadataDetails metadata={csiNode.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <CSIDriversList drivers={csiNode.spec.drivers} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};