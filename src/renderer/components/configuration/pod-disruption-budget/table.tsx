import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PodDisruptionBudgetResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  pdbs: k8s.V1PodDisruptionBudgetList;
}

export const PodDisruptionBudgetList = ({ pdbs }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Min Available', 'Max Unavailable', 'Allowed Disruptions', 'Current', 'Desired', 'Total', 'Age'];

  const filteredPDBs = activeNamespace === "all" 
  ? pdbs.items 
  : pdbs.items.filter(pdb => pdb.metadata.namespace === activeNamespace);

  const processedRows = filteredPDBs.map(pdb => ({
    Name: <PodDisruptionBudgetResourceLink name={pdb.metadata.name} namespace={pdb.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={pdb.metadata.namespace} />,
    'Min Available': pdb.spec?.minAvailable || '-',
    'Max Unavailable': pdb.spec?.maxUnavailable || '-',
    'Allowed Disruptions': pdb.status?.disruptionsAllowed || '-',
    Current: pdb.status?.currentHealthy || '-',
    Desired: pdb.status?.desiredHealthy || '-',
    Total: pdb.status?.expectedPods || '-',
    Age: pdb.metadata.creationTimestamp 
      ? calculateAge(new Date(pdb.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};