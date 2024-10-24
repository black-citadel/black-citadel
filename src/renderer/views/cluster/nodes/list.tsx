import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { NodeList } from '@components/cluster/node/table';
export const NodesListView = () => {
  const [nodes, setNodes] = useState<k8s.V1NodeList>();
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
      <ListHeader resource={Resources.Nodes} error={error} />
      {nodes && <NodeList nodes={nodes} />}
    </>
  );
};

export default NodesListView;
