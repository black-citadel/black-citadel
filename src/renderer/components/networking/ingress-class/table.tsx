import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { IngressClassResourceLink } from './resource-link';

interface Props {
  ingressClasses: k8s.V1IngressClassList;
}

export const IngressClassList = ({ ingressClasses }: Props): JSX.Element => {
  const headers = ['Name', 'Controller', 'Parameters', 'Age'];

  const processedRows = ingressClasses.items.map(ingressClass => ({
    Name: <IngressClassResourceLink name={ingressClass.metadata.name} namespace={ingressClass.metadata.namespace} />,
    Controller: ingressClass.spec?.controller || '-',
    Parameters: ingressClass.spec?.parameters ? JSON.stringify(ingressClass.spec.parameters) : '-',
    Age: ingressClass.metadata.creationTimestamp 
      ? calculateAge(new Date(ingressClass.metadata.creationTimestamp))
      : '-'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};