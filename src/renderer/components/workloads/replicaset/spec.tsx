import k8s = require('@kubernetes/client-node');
import { Subheading } from '@components/base/heading';
import { DetailsItem } from '@components/details-item';

interface ReplicaSetSpecProps {
  spec: k8s.V1ReplicaSetSpec;
}

export const ReplicaSetSpec = ({ spec }: ReplicaSetSpecProps): JSX.Element => {
  return (
    <>
      <Subheading className='mt-8 mb-4'>Spec</Subheading>
      <div>
        <DetailsItem label="Replicas">
          {spec.replicas || 0}
        </DetailsItem>
        <DetailsItem label="Min Ready Seconds">
          {spec.minReadySeconds || 0}
        </DetailsItem>
        <DetailsItem label="Selector">
          <div className="space-y-1">
            {spec.selector?.matchLabels && (
              <div>
                <span className="font-medium text-zinc-500">Match Labels:</span>
                {Object.entries(spec.selector.matchLabels).map(([key, value]) => (
                  <div key={key} className="ml-4 text-sm">
                    <span className="font-mono">{key}</span>: <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {spec.selector?.matchExpressions && spec.selector.matchExpressions.length > 0 && (
              <div className="mt-2">
                <span className="font-medium text-zinc-500">Match Expressions:</span>
                {spec.selector.matchExpressions.map((expr, index) => (
                  <div key={index} className="ml-4 text-sm">
                    <span className="font-mono">{expr.key}</span> {expr.operator} [{expr.values?.join(', ')}]
                  </div>
                ))}
              </div>
            )}
          </div>
        </DetailsItem>
      </div>
    </>
  );
};