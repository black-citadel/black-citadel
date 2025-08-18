import { useEffect, useState } from 'react';
import { V1CSIDriverList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { CSIDriverList } from '@components/storage/csi-driver/table';
import { Resources, ResourceAction } from '@utils/enums';
import { Button } from '@protoku-bv/design-system';
import { useView } from '@context/viewProvider';

export const CSIDriversListView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [csiDrivers, setCSIDrivers] = useState<V1CSIDriverList>();
  const [error, setError] = useState<string | null>(null);

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

  const handleCreate = () => {
    setViewContext({
      resource: Resources.CSIDrivers,
      action: ResourceAction.Create
    });
  };

  return (
    <>
      <ListHeader 
        resource={Resources.CSIDrivers} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary" onClick={handleCreate}>
            Create CSI Driver
          </Button>
        }
      />
      {csiDrivers && <CSIDriverList csiDrivers={csiDrivers} />}
    </>
  );
};