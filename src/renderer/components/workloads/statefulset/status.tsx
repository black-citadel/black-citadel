import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface StatefulSetStatusProps {
  status: k8s.V1StatefulSetStatus;
}

export const StatefulSetStatus = ({ status }: StatefulSetStatusProps): JSX.Element => {
  return (
    <DetailsItem label="Status">
      <div>Replicas: {status.replicas}</div>
      <div>Ready Replicas: {status.readyReplicas}</div>
      <div>Current Replicas: {status.currentReplicas}</div>
      <div>Updated Replicas: {status.updatedReplicas}</div>
      <div>Current Revision: {status.currentRevision}</div>
      <div>Update Revision: {status.updateRevision}</div>
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