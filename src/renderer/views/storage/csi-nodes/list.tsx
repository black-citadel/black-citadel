import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { CSINodeList } from '@components/storage/csi-node/table';
import { Resources } from '@utils/enums';

export const CSINodesListView = (): JSX.Element => {
  const [csiNodes, setCSINodes] = useState<k8s.V1CSINodeList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listCSINode();
      setCSINodes(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch CSI Nodes:", e);
      setError("Failed to fetch CSI Nodes.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.CSINodes} error={error} />
      {csiNodes && <CSINodeList csiNodes={csiNodes} />}
    </>
  );
};