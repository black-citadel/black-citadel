import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface UpdateStrategyProps {
    strategy: k8s.V1DaemonSetUpdateStrategy;
  }
  
  export const UpdateStrategy = ({ strategy }: UpdateStrategyProps): JSX.Element => {
    return (
      <DetailsItem label="Update Strategy">
        <div>Type: {strategy.type}</div>
        {strategy.rollingUpdate && (
          <div>
            Max Unavailable: {strategy.rollingUpdate.maxUnavailable}
          </div>
        )}
      </DetailsItem>
    );
  };