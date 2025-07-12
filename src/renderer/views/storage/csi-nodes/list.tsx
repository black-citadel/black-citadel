import { useEffect, useState } from 'react';
import { V1CSINodeList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { CSINodeList } from '@components/storage/csi-node/table';
import { Resources } from '@utils/enums';

export const CSINodesListView = (): JSX.Element => {
  const [csiNodes, setCSINodes] = useState<V1CSINodeList>();
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
      <ListHeader 
        resource={Resources.CSINodes} 
        error={error}
        showNamespaceDropdown={false}
      />
      {csiNodes && <CSINodeList csiNodes={csiNodes} />}
    </>
  );
};