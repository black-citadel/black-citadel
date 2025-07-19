import { useEffect, useState } from 'react';
import { V1SecretList } from '@utils/k8s-types';
import { ListHeader } from '@components/list-header';
import { SecretList } from '@components/configuration/secret/table';
import { Button } from '@protoku/design-system';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const SecretsListView = (): JSX.Element => {
  const [secrets, setSecrets] = useState<V1SecretList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listSecretForAllNamespaces();
      setSecrets(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch secrets:", e);
      setError("Failed to fetch secrets.");
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
        resource={Resources.Secrets} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button variant="primary"
            onClick={() => setViewContext({resource: Resources.Secrets, action: ResourceAction.Create})} 
          >
            Create Secret
          </Button>
        }
      />
      {secrets && <SecretList secrets={secrets} />}
    </>
  );
};