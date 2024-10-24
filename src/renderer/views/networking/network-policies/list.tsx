import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { NetworkPolicyList } from '@components/networking/network-policy/table';
import { Resources } from '@utils/enums';

export const NetworkPoliciesListView = (): JSX.Element => {
  const [networkPolicies, setNetworkPolicies] = useState<k8s.V1NetworkPolicyList>();
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listNetworkPolicyForAllNamespaces();
      setNetworkPolicies(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch network policies:", e);
      setError("Failed to fetch network policies.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ListHeader resource={Resources.NetworkPolicies} error={error} />
      {networkPolicies && <NetworkPolicyList networkPolicies={networkPolicies} />}
    </>
  );
};