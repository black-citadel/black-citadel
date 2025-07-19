import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable, type SortConfig } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { sortRows } from '@utils/sorting';
import { CustomResourceDefinitionResourceLink } from './resource-link';

interface Props {
  customResourceDefinitions: k8s.V1CustomResourceDefinitionList;
}

interface DataRow {
  Name: string;
  Group: string;
  Scope: string;
  Kind: string;
  Age: number;
  _display: {
    Name: JSX.Element;
    Group: string;
    Scope: string;
    Kind: string;
    Age: string;
  };
}

export const CustomResourceDefinitionList = ({ customResourceDefinitions }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const headers = ['Name', 'Group', 'Scope', 'Kind', 'Age'];

  // Create data rows with raw values for sorting
  const dataRows: DataRow[] = customResourceDefinitions.items.map(crd => ({
    Name: crd.metadata?.name || '',
    Group: crd.spec?.group || 'N/A',
    Scope: crd.spec?.scope || 'N/A',
    Kind: crd.spec?.names?.kind || 'N/A',
    Age: crd.metadata?.creationTimestamp ? new Date(crd.metadata.creationTimestamp).getTime() : 0,
    _display: {
      Name: <CustomResourceDefinitionResourceLink name={crd.metadata?.name} />,
      Group: crd.spec?.group || 'N/A',
      Scope: crd.spec?.scope || 'N/A',
      Kind: crd.spec?.names?.kind || 'N/A',
      Age: crd.metadata?.creationTimestamp
        ? calculateAge(new Date(crd.metadata.creationTimestamp))
        : 'N/A'
    }
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => ({
    Name: row._display.Name,
    Group: row._display.Group,
    Scope: row._display.Scope,
    Kind: row._display.Kind,
    Age: row._display.Age
  }));

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};