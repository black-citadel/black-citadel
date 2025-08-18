import { useEffect, useState } from 'react';
import { V1StorageClassList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { StorageClassList } from '@components/storage/storage-class/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const StorageClassesListView = (): JSX.Element => {
  const [storageClasses, setStorageClasses] = useState<V1StorageClassList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listStorageClass();
      setStorageClasses(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Storage Classes:", e);
      setError("Failed to fetch Storage Classes.");
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
        resource={Resources.StorageClasses} 
        error={error}
        showNamespaceDropdown={false}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.StorageClasses, action: ResourceAction.Create})} 
          >
            Create Storage Class
          </Button>
        }
      />
      {storageClasses && <StorageClassList storageClasses={storageClasses} />}
    </>
  );
};