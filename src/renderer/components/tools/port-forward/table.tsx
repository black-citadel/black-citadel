import { useMemo } from 'react';
import { ListTable } from '@components/list-table';
import { Badge } from '@components/base/badge';
import { Button } from '@components/base/button';
import { PortForwardInfo } from '@utils/types';
import { calculateAge } from '@utils/helpers';
import { ResourceLink } from '@components/base/resource-link';
import { Resources, PortForwardStatus } from '@utils/enums';

interface PortForwardTableProps {
  portForwards: PortForwardInfo[];
  onStop: (forwardId: string) => void;
  onCopyUrl: (portForward: PortForwardInfo) => void;
  onOpen: (portForward: PortForwardInfo) => void;
}

export const PortForwardTable = ({ 
  portForwards, 
  onStop, 
  onCopyUrl, 
  onOpen 
}: PortForwardTableProps) => {
  const rows = useMemo(() => {
    return portForwards.map((pf) => {
      const statusColor = {
        [PortForwardStatus.Active]: 'green',
        [PortForwardStatus.Connecting]: 'yellow',
        [PortForwardStatus.Failed]: 'red',
        [PortForwardStatus.Stopping]: 'gray'
      }[pf.status] || 'gray';

      const isHttp = pf.remotePort === 80 || pf.remotePort === 8080 || pf.remotePort === 3000;
      const isHttps = pf.remotePort === 443 || pf.remotePort === 8443;
      const url = `${isHttps ? 'https' : 'http'}://${pf.localAddress}:${pf.localPort}`;

      return {
        Resource: (
          <div className="flex items-center space-x-2">
            <ResourceLink 
              resource={pf.resourceType === 'pod' ? Resources.Pods : Resources.Services}
              name={pf.resourceName}
              namespace={pf.namespace}
            />
          </div>
        ),
        Type: (
          <Badge color={pf.resourceType === 'pod' ? 'pod' : 'blue'}>
            {pf.resourceType}
          </Badge>
        ),
        Namespace: pf.namespace,
        'Local → Remote': `${pf.localPort} → ${pf.remotePort}`,
        Status: (
          <Badge color={statusColor as any}>
            {pf.status}
          </Badge>
        ),
        Uptime: calculateAge(pf.startTime),
        Actions: (
          <div className="flex items-center space-x-2">
            {pf.status === PortForwardStatus.Active && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onStop(pf.id)}
                >
                  Stop
                </Button>
                {(isHttp || isHttps) && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onCopyUrl(pf)}
                    >
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onOpen(pf)}
                    >
                      Open
                    </Button>
                  </>
                )}
              </>
            )}
            {pf.status === PortForwardStatus.Failed && pf.error && (
              <span className="text-sm text-red-500">{pf.error}</span>
            )}
          </div>
        )
      };
    });
  }, [portForwards, onStop, onCopyUrl, onOpen]);

  return (
    <ListTable
      headers={['Resource', 'Type', 'Namespace', 'Local → Remote', 'Status', 'Uptime', 'Actions']}
      rows={rows}
    />
  );
};