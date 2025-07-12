import { useEffect, useState } from 'react';
import { V1PersistentVolumeList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { PersistentVolumeList } from '@components/storage/persistent-volume/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const PersistentVolumesListView = (): JSX.Element => {
  const [pvs, setPVs] = useState<V1PersistentVolumeList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPersistentVolume();
      setPVs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Persistent Volumes:", e);
      setError("Failed to fetch Persistent Volumes.");
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
        resource={Resources.PersistentVolumes} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.PersistentVolumes, action: ResourceAction.Create})} 
            
          >
            Create Persistent Volume
          </Button>
        }
      />
      {pvs && <PersistentVolumeList pvs={pvs} />}
    </>
  );
};