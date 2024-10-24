import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface SchedulingProps {
    scheduling?: k8s.V1Scheduling;
  }
  
  export const Scheduling = ({ scheduling }: SchedulingProps): JSX.Element => {
    if (!scheduling) {
      return <DetailsItem label="Scheduling">Not specified</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Scheduling">
        <div>Node Selector: {scheduling.nodeSelector ? JSON.stringify(scheduling.nodeSelector) : 'Not specified'}</div>
        <div>Tolerations:</div>
        {scheduling.tolerations && scheduling.tolerations.map((toleration, index) => (
          <div key={index} className="ml-4">
            <div>Key: {toleration.key}</div>
            <div>Operator: {toleration.operator}</div>
            <div>Value: {toleration.value}</div>
            <div>Effect: {toleration.effect}</div>
            <div>Toleration Seconds: {toleration.tolerationSeconds}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };
  