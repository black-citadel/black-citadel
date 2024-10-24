import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { ConfigMapList } from '@components/configuration/config-map/table';
import { Resources } from '@utils/enums';

export const ConfigMapsListView = (): JSX.Element => {
  const [configMaps, setConfigMaps] = useState<k8s.V1ConfigMapList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listConfigMapForAllNamespaces();
      setConfigMaps(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch config maps:", e);
      setError("Failed to fetch config maps.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.ConfigMaps} error={error} />
      {configMaps && <ConfigMapList configMaps={configMaps} />}
    </>
  );
};