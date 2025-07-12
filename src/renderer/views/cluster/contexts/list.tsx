import { useEffect, useState } from 'react';
import { Context } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { Resources, ResourceAction } from '@utils/enums';
import { ContextList } from '@components/cluster/context/table';
import { Button } from '@protoku/design-system';
import { useView } from '@context/viewProvider';

export const ContextsListView = (): JSX.Element => {
  const [contexts, setContexts] = useState<Context[]>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.getContexts();
      setContexts(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch deployments:", e);
      setError("Failed to fetch deployments.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader 
        resource={Resources.Contexts} 
        error={error}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({ resource: Resources.Contexts, action: ResourceAction.Create })} 
            
          >
            Add new Context
          </Button>
        }
      />

      {contexts && <ContextList contexts={contexts} />}
    </>
  );
};