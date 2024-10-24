import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { PersistentVolumeClaimList } from '@components/storage/persistent-volume-claim/table';
import { Resources } from '@utils/enums';

export const PersistentVolumeClaimsListView = (): JSX.Element => {
  const [pvcs, setPVCs] = useState<k8s.V1PersistentVolumeClaimList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.PersistentVolumeClaims} error={error} />
      {pvcs && <PersistentVolumeClaimList pvcs={pvcs} />}
    </>
  );
};