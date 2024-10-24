import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface DaemonSetStatusProps {
    status: k8s.V1DaemonSetStatus;
  }
  
  export const DaemonSetStatus = ({ status }: DaemonSetStatusProps): JSX.Element => {
    return (
      <DetailsItem label="Status">
        <div>Current Number Scheduled: {status.currentNumberScheduled}</div>
        <div>Desired Number Scheduled: {status.desiredNumberScheduled}</div>
        <div>Number Ready: {status.numberReady}</div>
        <div>Updated Number Scheduled: {status.updatedNumberScheduled}</div>
        <div>Number Available: {status.numberAvailable}</div>
        <div>Number Misscheduled: {status.numberMisscheduled}</div>
      </DetailsItem>
    );
  };