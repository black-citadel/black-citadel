import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface AggregationRuleListProps {
  aggregationRule?: k8s.V1AggregationRule;
}

export const AggregationRuleList = ({ aggregationRule }: AggregationRuleListProps): JSX.Element => {
  if (!aggregationRule || !aggregationRule.clusterRoleSelectors || aggregationRule.clusterRoleSelectors.length === 0) {
    return <DetailsItem label="Aggregation Rule">None</DetailsItem>;
  }

  return (
    <DetailsItem label="Aggregation Rule">
      {aggregationRule.clusterRoleSelectors.map((selector, index) => (
        <div key={index} className="mb-2 p-2">
          <div>Match Labels:</div>
          {Object.entries(selector.matchLabels || {}).map(([key, value]) => (
            <div key={key}>
              <span className="bg-zinc-800 py-0.5 px-2 mb-2 rounded text-xs">
                {key}: {value}
              </span>
            </div>
          ))}
          {selector.matchExpressions && (
            <>
              <div>Match Expressions:</div>
              {selector.matchExpressions.map((expr, exprIndex) => (
                <div key={exprIndex}>
                  <span className="bg-zinc-800 py-0.5 px-2 mb-2 rounded text-xs">
                    {expr.key} {expr.operator} {expr.values?.join(', ')}
                  </span>
                </div>

              ))}
            </>
          )}
        </div>
      ))}
    </DetailsItem>
  );
};