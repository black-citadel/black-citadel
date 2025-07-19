import { DetailsItem } from '@components/details-item';
import { ListTable } from '@protoku/design-system';
import k8s = require('@kubernetes/client-node');

interface RuleListProps {
  rules?: k8s.V1PolicyRule[];
}

const NewLineList: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) return <span>*</span>;
  return (
    <ul className="list-none p-0 m-0">
      {items.map((item, _index) => (
        <li key={_index}>{item}</li>
      ))}
    </ul>
  );
};

export const RuleList = ({ rules }: RuleListProps): JSX.Element => {
  if (!rules || rules.length === 0) {
    return <DetailsItem label="Rules">None</DetailsItem>;
  }

  const headers = ['API Groups', 'Resources', 'Verbs', 'Resource Names', 'Non-Resource URLs'];

  const rows = rules.map((rule, _index) => ({
    'API Groups': <NewLineList items={rule.apiGroups} />,
    'Resources': <NewLineList items={rule.resources} />,
    'Verbs': <NewLineList items={rule.verbs} />,
    'Resource Names': <NewLineList items={rule.resourceNames} />,
    'Non-Resource URLs': <NewLineList items={rule.nonResourceURLs} />,
  }));

  return (
    <ListTable headers={headers} rows={rows} />
  );
};