import { useEffect, useState } from 'react';
import { V1CustomResourceDefinitionList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { CustomResourceDefinitionList } from '@components/cluster/custom-resource-definition/table';
import { Resources } from '@utils/enums';

export const CustomResourceDefinitionsListView = (): JSX.Element => {
  const [crds, setCrds] = useState<V1CustomResourceDefinitionList>();
  const [error, setError] = useState<string | null>(null);

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