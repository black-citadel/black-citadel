import { useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { sortRows, type SortConfig } from '@utils/sorting';
import { ContextResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { CheckIcon } from '@heroicons/react/16/solid';
import { Button } from '@protoku/design-system';

interface Props {
  contexts: k8s.Context[];
}

interface DataRow {
  Name: string;
  Cluster: string;
  User: string;
  Namespace: string;
  Current: string;
  _display: {
    Name: JSX.Element;
    Cluster: string;
    User: string;
    Namespace: string | undefined;
    Current: JSX.Element;
  };
}

export const ContextList = ({ contexts }: Props): JSX.Element => {
  const { activeContext, setActiveContext } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();

  const headers = ['Name', 'Cluster', 'User', 'Namespace', 'Current'];

  const handleContextChange = async (value: string) => {
    await window.electronAPI.setCurrentContext(value);
    setActiveContext(value);
  };

  // Create data rows with raw values for sorting
  const dataRows: DataRow[] = contexts.map(ctx => ({
    Name: ctx.name || '',
    Cluster: ctx.cluster || '-',
    User: ctx.user || '-',
    Namespace: ctx.namespace || '',
    Current: ctx.name === activeContext ? '1' : '0', // Use '1' for current, '0' for others for sorting
    _display: {
      Name: <ContextResourceLink name={ctx.name} />,
      Cluster: ctx.cluster || '-',
      User: ctx.user || '-',
      Namespace: ctx.namespace,
      Current: (
        ctx.name === activeContext ? (
          <CheckIcon className="text-green-500 w-6 h-6" />
        ) : (
          <Button className='font-xs'
            onClick={() => handleContextChange(ctx.name)}
            variant="secondary"
          >
            Use context
          </Button>
        )
      )
    }
  }));

  // Sort the data rows
  const sortedRows = sortRows(dataRows, sortConfig);

  // Map sorted data to display components
  const processedRows = sortedRows.map(row => ({
    Name: row._display.Name,
    Cluster: row._display.Cluster,
    User: row._display.User,
    Namespace: row._display.Namespace,
    Current: row._display.Current
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