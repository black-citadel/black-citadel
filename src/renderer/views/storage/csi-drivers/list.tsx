import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { CSIDriverList } from '@components/storage/csi-driver/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const CSIDriversListView = (): JSX.Element => {
  const [csiDrivers, setCSIDrivers] = useState<k8s.V1CSIDriverList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listCSIDriver();
      setCSIDrivers(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch CSI Drivers:", e);
      setError("Failed to fetch CSI Drivers.");
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
        resource={Resources.CSIDrivers} 
        error={error}
        showNamespaceDropdown={false}
      />
      {csiDrivers && <CSIDriverList csiDrivers={csiDrivers} />}
    </>
  );
};