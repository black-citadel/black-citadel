import { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { ListHeader } from '@components/list-header';
import { NetworkPolicyList } from '@components/networking/network-policy/table';
import { Button } from '@components/base/button';
import { Resources, ResourceAction } from '@utils/enums';
import { useView } from '@context/viewProvider';

export const NetworkPoliciesListView = (): JSX.Element => {
  const [networkPolicies, setNetworkPolicies] = useState<k8s.V1NetworkPolicyList>();
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

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
      <ListHeader 
        resource={Resources.NetworkPolicies} 
        error={error}
        showNamespaceDropdown={true}
        actions={
          <Button 
            onClick={() => setViewContext({ resource: Resources.NetworkPolicies, action: ResourceAction.Create})} 
            outline
          >
            Create Network Policy
          </Button>
        }
      />
      {networkPolicies && <NetworkPolicyList networkPolicies={networkPolicies} />}
    </>
  );
};