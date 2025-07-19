import { useEffect, useState } from 'react';
import { V1NodeList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { NodeList } from '@components/cluster/node/table';

export const NodesListView = (): JSX.Element => {
  const [nodes, setNodes] = useState<V1NodeList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listNode();
      setNodes(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Nodes:", e);
      setError("Failed to fetch Nodes.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader 
        resource={Resources.Nodes} 
        error={error}
        showNamespaceDropdown={false}
      />
      {nodes && <NodeList nodes={nodes} />}
    </>
  );
};
