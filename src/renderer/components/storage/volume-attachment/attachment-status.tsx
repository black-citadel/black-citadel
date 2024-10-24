import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface AttachmentStatusProps {
    status?: k8s.V1VolumeAttachmentStatus;
  }
  
  export const AttachmentStatus = ({ status }: AttachmentStatusProps): JSX.Element => {
    if (!status) {
      return <DetailsItem label="Status">No status information available</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Status">
        <div>Attached: {status.attached.toString()}</div>
        {status.attachmentMetadata && (
          <div>
            <div>Attachment Metadata:</div>
            {Object.entries(status.attachmentMetadata).map(([key, value]) => (
              <div key={key} className="ml-4">
                <span className="font-semibold">{key}:</span> {value}
              </div>
            ))}
          </div>
        )}
        {status.attachError && (
          <div>
            <div>Attach Error:</div>
            <div className="ml-4">Message: {status.attachError.message}</div>
            <div className="ml-4">Time: {new Date(status.attachError.time).toLocaleString()}</div>
          </div>
        )}
        {status.detachError && (
          <div>
            <div>Detach Error:</div>
            <div className="ml-4">Message: {status.detachError.message}</div>
            <div className="ml-4">Time: {new Date(status.detachError.time).toLocaleString()}</div>
          </div>
        )}
      </DetailsItem>
    );
  };