import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface DeploymentStrategyProps {
    strategy: k8s.V1DeploymentStrategy;
  }
  
  export const DeploymentStrategy = ({ strategy }: DeploymentStrategyProps): JSX.Element => {
    return (
      <DetailsItem label="Deployment Strategy">
        <div>Type: {strategy.type}</div>
        {strategy.rollingUpdate && (
          <div>
            <div>Max Surge: {strategy.rollingUpdate.maxSurge}</div>
            <div>Max Unavailable: {strategy.rollingUpdate.maxUnavailable}</div>
          </div>
        )}
      </DetailsItem>
    );
  };