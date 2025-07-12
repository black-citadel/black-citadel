import { useEffect, useState } from 'react';
import { V1ConfigMapList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { ConfigMapList } from '@components/configuration/config-map/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const ConfigMapsListView = (): JSX.Element => {
  const [configMaps, setConfigMaps] = useState<V1ConfigMapList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.ConfigMaps} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.ConfigMaps, action: ResourceAction.Create})} 
            
          >
            Create ConfigMap
          </Button>
        }
      />
      {configMaps && <ConfigMapList configMaps={configMaps} />}
    </>
  );
};