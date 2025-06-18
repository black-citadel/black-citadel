import { useEffect, useState } from 'react';
import { ListHeader } from '@components/list-header';
import { PortForwardTable } from '@components/tools/port-forward/table';
import { PortForwardInfo } from '@utils/types';
import { Resources } from '@utils/enums';

export const PortForwardsListView = (): JSX.Element => {
  const [portForwards, setPortForwards] = useState<PortForwardInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listPortForwards();
      setPortForwards(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch port forwards:", e);
      setError("Failed to fetch port forwards.");
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll more frequently since port forwards can change quickly
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStop = async (forwardId: string) => {
    try {
      const result = await window.electronAPI.stopPortForward(forwardId);
      if (!result.success) {
        console.error('Failed to stop port forward:', result.error);
      }
      // Refresh the list
      fetchData();
    } catch (e) {
      console.error('Failed to stop port forward:', e);
    }
  };

  const handleCopyUrl = (portForward: PortForwardInfo) => {
    const isHttps = portForward.remotePort === 443 || portForward.remotePort === 8443;
    const url = `${isHttps ? 'https' : 'http'}://${portForward.localAddress}:${portForward.localPort}`;
    navigator.clipboard.writeText(url);
    
    // Could add a toast notification here
    console.log('Copied URL to clipboard:', url);
  };

  const handleOpen = async (portForward: PortForwardInfo) => {
    const isHttps = portForward.remotePort === 443 || portForward.remotePort === 8443;
    const url = `${isHttps ? 'https' : 'http'}://${portForward.localAddress}:${portForward.localPort}`;
    await window.electronAPI.openExternalLink(url);
  };

  return (
    <>
      <ListHeader 
        resource={Resources.PortForwards} 
        error={error}
        showNamespaceDropdown={false}
      />

      <div className='m-2'>
        {portForwards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active port forwards. Start a port forward from a Pod or Service details view.
          </div>
        ) : (
          <PortForwardTable
            portForwards={portForwards}
            onStop={handleStop}
            onCopyUrl={handleCopyUrl}
            onOpen={handleOpen}
          />
        )}
      </div>
    </>
  );
};

export default PortForwardsListView;