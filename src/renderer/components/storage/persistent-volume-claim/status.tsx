import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface PVCStatusProps {
    status?: k8s.V1PersistentVolumeClaimStatus;
  }
  
  export const PVCStatus = ({ status }: PVCStatusProps): JSX.Element => {
    if (!status) {
      return <DetailsItem label="Status">No status information available</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Status">
        <div>Phase: {status.phase}</div>
        <div>Access Modes: {status.accessModes?.join(', ') || 'None'}</div>
        <div>Capacity: {status.capacity?.storage || 'Not specified'}</div>
        {status.conditions && status.conditions.map((condition, index) => (
          <div key={index}>
            <div>Type: {condition.type}</div>
            <div>Status: {condition.status}</div>
            {condition.lastProbeTime && <div>Last Probe Time: {new Date(condition.lastProbeTime).toLocaleString()}</div>}
            {condition.lastTransitionTime && <div>Last Transition Time: {new Date(condition.lastTransitionTime).toLocaleString()}</div>}
            <div>Reason: {condition.reason}</div>
            <div>Message: {condition.message}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };