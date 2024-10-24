import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getStatus } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { DaemonSetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  daemonSets: k8s.V1DaemonSetList
}

export const DaemonSetList = ({ daemonSets }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Desired', 'Current', 'Ready', 'Up-to-date', 'Available', 'Age'];

  const filteredDaemonSets = activeNamespace === "all" 
  ? daemonSets.items 
  : daemonSets.items.filter(daemonSet => daemonSet.metadata.namespace === activeNamespace);

  const processedRows = filteredDaemonSets.map(daemonSet => ({
    Name: <DaemonSetResourceLink name={daemonSet.metadata.name} namespace={daemonSet.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={daemonSet.metadata.namespace} />,
    Desired: daemonSet.status.desiredNumberScheduled,
    Current: daemonSet.status.currentNumberScheduled,
    Ready: getStatus(daemonSet),
    'Up-to-date': daemonSet.status.updatedNumberScheduled,
    Available: daemonSet.status.numberAvailable,
    Age: calculateAge(daemonSet.metadata.creationTimestamp)
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}