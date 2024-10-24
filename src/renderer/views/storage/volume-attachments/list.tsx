import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { VolumeAttachmentList } from '@components/storage/volume-attachment/table';
import { Resources } from '@utils/enums';

export const VolumeAttachmentsListView = (): JSX.Element => {
  const [volumeAttachments, setVolumeAttachments] = useState<k8s.V1VolumeAttachmentList>();
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

  return (
    <>
      <ListHeader resource={Resources.VolumeAttachments} error={error} />
      {volumeAttachments && <VolumeAttachmentList volumeAttachments={volumeAttachments} />}
    </>
  );
};