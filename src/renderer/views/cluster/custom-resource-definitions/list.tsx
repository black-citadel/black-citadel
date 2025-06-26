import { useEffect, useState } from 'react';
import k8s from '@kubernetes/client-node';
import { ListHeader } from '@components/list-header';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { CustomResourceDefinitionList } from '@components/cluster/custom-resource-definition/table';
import { useView } from '@context/viewProvider';

export const CustomResourceDefinitionsListView = () => {
  const [crds, setCrds] = useState<k8s.V1CustomResourceDefinitionList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listCustomResourceDefinition();
      setCrds(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch Custom Resource Definitions:", e);
      setError("Failed to fetch Custom Resource Definitions.");
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
        resource={Resources.CustomResourceDefinitions} 
        error={error}
        showNamespaceDropdown={false}
      />
      {crds && <CustomResourceDefinitionList customResourceDefinitions={crds} />}
    </>
  );
};

export default CustomResourceDefinitionsListView;