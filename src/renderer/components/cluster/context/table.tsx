import k8s from '@kubernetes/client-node';
import { ListTable } from '@components/list-table';
import { ContextResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { CheckIcon } from '@heroicons/react/16/solid';
import { Button } from '@protoku/design-system';

interface Props {
  contexts: k8s.Context[];
}

export const ContextList = ({ contexts }: Props): JSX.Element => {
  const { activeContext, setActiveContext } = useView();

  const headers = ['Name', 'Cluster', 'User', 'Namespace', 'Current'];

  const processedRows = contexts.map(ctx => ({
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
  }));

  const handleContextChange = async (value: string) => {
    await window.electronAPI.setCurrentContext(value);
    setActiveContext(value);
  };

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};