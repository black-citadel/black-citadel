import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface JobStatusProps {
  status: k8s.V1JobStatus;
}

export const JobStatus = ({ status }: JobStatusProps): JSX.Element => {
  return (
    <DetailsItem label="Status">
      <div>Active: {status.active}</div>
      <div>Succeeded: {status.succeeded}</div>
      <div>Failed: {status.failed}</div>
      <div>Completion Time: {status.completionTime ? new Date(status.completionTime).toLocaleString() : 'N/A'}</div>
      <div>Start Time: {status.startTime ? new Date(status.startTime).toLocaleString() : 'N/A'}</div>
      {status.conditions && status.conditions.map((condition, index) => (
        <div key={index}>
          <div>Type: {condition.type}</div>
          <div>Status: {condition.status}</div>
          <div>Reason: {condition.reason}</div>
          <div>Message: {condition.message}</div>
        </div>
      ))}
    </DetailsItem>
  );
};