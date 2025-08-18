import { useEffect, useState } from 'react';
import { V1PersistentVolumeClaimList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { PersistentVolumeClaimList } from '@components/storage/persistent-volume-claim/table';
import { Button } from '@protoku-bv/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const PersistentVolumeClaimsListView = (): JSX.Element => {
  const [pvcs, setPVCs] = useState<V1PersistentVolumeClaimList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPersistentVolumeClaimForAllNamespaces();
      setPVCs(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Persistent Volume Claims:", e);
      setError("Failed to fetch Persistent Volume Claims.");
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
        resource={Resources.PersistentVolumeClaims} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.PersistentVolumeClaims, action: ResourceAction.Create})} 
          >
            Create Persistent Volume Claim
          </Button>
        }
      />
      {pvcs && <PersistentVolumeClaimList pvcs={pvcs} />}
    </>
  );
};