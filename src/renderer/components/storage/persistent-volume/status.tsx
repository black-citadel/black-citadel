import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface PVStatusProps {
    status?: k8s.V1PersistentVolumeStatus;
  }
  
  export const PVStatus = ({ status }: PVStatusProps): JSX.Element => {
    if (!status) {
      return <DetailsItem label="Status">No status information available</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Status">
        <div>Phase: {status.phase}</div>
        <div>Reason: {status.reason || 'N/A'}</div>
        <div>Message: {status.message || 'N/A'}</div>
      </DetailsItem>
    );
  };