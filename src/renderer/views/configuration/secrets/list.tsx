import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { SecretList } from '@components/configuration/secret/table';
import { Resources } from '@utils/enums';

export const SecretsListView = (): JSX.Element => {
  const [secrets, setSecrets] = useState<k8s.V1SecretList>();
  const [error, setError] = useState<string | null>(null);

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
      <ListHeader resource={Resources.Secrets} error={error} />
      {secrets && <SecretList secrets={secrets} />}
    </>
  );
};