import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { CustomResourceDefinitionResourceLink } from './resource-link';

interface Props {
  customResourceDefinitions: k8s.V1CustomResourceDefinitionList;
}

export const CustomResourceDefinitionList = ({ customResourceDefinitions }: Props): JSX.Element => {
  const headers = ['Name', 'Group', 'Scope', 'Kind', 'Age'];

  const processedRows = customResourceDefinitions.items.map(crd => ({
    Name: <CustomResourceDefinitionResourceLink name={crd.metadata?.name} />,
    Group: crd.spec?.group || 'N/A',
    Scope: crd.spec?.scope || 'N/A',
    Kind: crd.spec?.names?.kind || 'N/A',
    Age: crd.metadata?.creationTimestamp
      ? calculateAge(new Date(crd.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};