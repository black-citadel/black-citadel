import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { LimitRangeResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  limitRanges: k8s.V1LimitRangeList;
}

export const LimitRangeList = ({ limitRanges }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const headers = ['Name', 'Namespace', 'Limits'];

  const filteredLimitRanges = activeNamespace === "all"
    ? limitRanges.items
    : limitRanges.items.filter(limitRange => limitRange.metadata.namespace === activeNamespace);

  const processedRows = filteredLimitRanges.map(limitRange => ({
    Name: <LimitRangeResourceLink name={limitRange.metadata.name} namespace={limitRange.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={limitRange.metadata.namespace} />,
    Limits: limitRange.spec.limits.length,
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};