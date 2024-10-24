import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface ReplicaSetStatusProps {
    status: k8s.V1ReplicaSetStatus;
  }
  
  export const ReplicaSetStatus = ({ status }: ReplicaSetStatusProps): JSX.Element => {
    return (
      <DetailsItem label="Status">
        <div>Replicas: {status.replicas}</div>
        <div>Fully Labeled Replicas: {status.fullyLabeledReplicas}</div>
        <div>Ready Replicas: {status.readyReplicas}</div>
        <div>Available Replicas: {status.availableReplicas}</div>
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
  