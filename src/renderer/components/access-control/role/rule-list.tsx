import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface RuleListProps {
    rules?: k8s.V1PolicyRule[];
  }
  
  export const RuleList = ({ rules }: RuleListProps): JSX.Element => {
    if (!rules || rules.length === 0) {
      return <DetailsItem label="Rules">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Rules">
        {rules.map((rule, _index) => (
          <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
            <div>API Groups: {rule.apiGroups?.join(', ') || '*'}</div>
            <div>Resources: {rule.resources?.join(', ') || '*'}</div>
            <div>Verbs: {rule.verbs.join(', ')}</div>
            {rule.resourceNames && <div>Resource Names: {rule.resourceNames.join(', ')}</div>}
            {rule.nonResourceURLs && <div>Non-Resource URLs: {rule.nonResourceURLs.join(', ')}</div>}
          </div>
        ))}
      </DetailsItem>
    );
  };