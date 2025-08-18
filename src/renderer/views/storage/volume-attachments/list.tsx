import { useEffect, useState } from 'react';
import { V1VolumeAttachmentList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { VolumeAttachmentList } from '@components/storage/volume-attachment/table';
import { Resources, ResourceAction } from '@utils/enums';
import { Button } from '@protoku-bv/design-system';
import { useView } from '@context/viewProvider';

export const VolumeAttachmentsListView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [volumeAttachments, setVolumeAttachments] = useState<V1VolumeAttachmentList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listVolumeAttachment();
      setVolumeAttachments(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Volume Attachments:", e);
      setError("Failed to fetch Volume Attachments.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCreate = () => {
    setViewContext({
      resource: Resources.VolumeAttachments,
      action: ResourceAction.Create
    });
  };

  return (
    <>
      <ListHeader 
        resource={Resources.VolumeAttachments} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary" onClick={handleCreate}>
            Create Volume Attachment
          </Button>
        }
      />
      {volumeAttachments && <VolumeAttachmentList volumeAttachments={volumeAttachments} />}
    </>
  );
};