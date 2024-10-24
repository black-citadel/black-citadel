import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface PodStatusProps {
    status: k8s.V1PodStatus;
  }
  
  export const PodStatus = ({ status }: PodStatusProps): JSX.Element => {
    return (
      <DetailsItem label="Status">
        <div>Phase: {status.phase}</div>
        <div>Pod IP: {status.podIP}</div>
        <div>Host IP: {status.hostIP}</div>
        <div>QoS Class: {status.qosClass}</div>
        {status.conditions && status.conditions.map((condition, index) => (
          <div key={index}>
            <div>Type: {condition.type}</div>
            <div>Status: {condition.status}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };