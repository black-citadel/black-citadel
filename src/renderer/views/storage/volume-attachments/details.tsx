import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { VolumeAttachmentBadge } from '@components/storage/volume-attachment/badge';
import { AttacherDetails } from '@components/storage/volume-attachment/attacher-details';
import { NodeDetails } from '@components/storage/volume-attachment/node-details';
import { SourceDetails } from '@components/storage/volume-attachment/source-details';
import { AttachmentStatus } from '@components/storage/volume-attachment/attachment-status';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';


export const VolumeAttachmentsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [volumeAttachment, setVolumeAttachment] = useState<k8s.V1VolumeAttachment>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readVolumeAttachment(viewContext.name);
      setVolumeAttachment(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch volume attachment:", e);
      setError("Failed to fetch volume attachment.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(volumeAttachment);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <VolumeAttachmentBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && volumeAttachment && (
        <div className='m-2'>
          <MetadataDetails metadata={volumeAttachment.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <AttacherDetails attacher={volumeAttachment.spec.attacher} />
          <NodeDetails nodeName={volumeAttachment.spec.nodeName} />
          <SourceDetails source={volumeAttachment.spec.source} />
          <AttachmentStatus status={volumeAttachment.status} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};