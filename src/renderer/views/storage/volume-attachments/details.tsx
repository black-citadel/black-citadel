import { V1VolumeAttachment } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { VolumeAttachmentBadge } from '@components/storage/volume-attachment/badge';
import { AttacherDetails } from '@components/storage/volume-attachment/attacher-details';
import { NodeDetails } from '@components/storage/volume-attachment/node-details';
import { SourceDetails } from '@components/storage/volume-attachment/source-details';
import { AttachmentStatus } from '@components/storage/volume-attachment/attachment-status';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';
import { ResourceActions } from '@components/resources/ResourceActions';


export const VolumeAttachmentsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [volumeAttachment, setVolumeAttachment] = useState<V1VolumeAttachment>();
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

  const handleDelete = async () => {
    await window.electronAPI.deleteVolumeAttachment(viewContext.name);
    setViewContext({ resource: Resources.VolumeAttachments, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.VolumeAttachments,
      action: ResourceAction.Edit,
      name: viewContext.name
    });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.VolumeAttachments}
            resourceName={viewContext.name}
            resource={volumeAttachment}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
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
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <AttacherDetails attacher={volumeAttachment.spec.attacher} />
              <NodeDetails nodeName={volumeAttachment.spec.nodeName} />
              <SourceDetails source={volumeAttachment.spec.source} />
            </div>
          </Container>

          <Container title="Status">
            <AttachmentStatus status={volumeAttachment.status} />
          </Container>

          <MetadataDetails metadata={volumeAttachment.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};