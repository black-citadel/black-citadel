import { useState, useMemo } from 'react';
import { ListTable, type SortConfig, Badge, Button, Status } from '@protoku-bv/design-system';
import { PortForwardInfo } from '@utils/types';
import { calculateAge } from '@utils/helpers';
import { ResourceLink } from '@components/base/resource-link';
import { Resources, PortForwardStatus } from '@utils/enums';
import { sortRows } from '@utils/sorting';

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
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const rows = useMemo(() => {
    // Create data rows with raw values for sorting
    const dataRows = portForwards.map((pf) => {
      const statusVariant = {
        [PortForwardStatus.Active]: 'success',
        [PortForwardStatus.Connecting]: 'warning',
        [PortForwardStatus.Failed]: 'error',
        [PortForwardStatus.Stopping]: 'default'
      }[pf.status] || 'default';

      const isHttp = pf.remotePort === 80 || pf.remotePort === 8080 || pf.remotePort === 3000;
      const isHttps = pf.remotePort === 443 || pf.remotePort === 8443;
      const url = `${isHttps ? 'https' : 'http'}://${pf.localAddress}:${pf.localPort}`;

      return {
        Resource: pf.resourceName,
        Namespace: pf.namespace,
        'Local → Remote': `${pf.localPort} → ${pf.remotePort}`,
        Status: pf.status,
        Uptime: pf.startTime.getTime(),
        Actions: pf.id,
        _raw: { pf, statusVariant, isHttp, isHttps, url }
      };
    });

    // Sort the data rows
    const sortedRows = sortRows(dataRows, sortConfig);

    // Map sorted data to React components
    return sortedRows.map(row => {
      const { pf, statusVariant, isHttp, isHttps, url: _url } = row._raw;
      
      return {
        Resource: (
          <div className="flex items-center space-x-2">
            <Badge variant={pf.resourceType === 'pod' ? 'blue' : 'green'}>
              {pf.resourceType}
            </Badge>
            <ResourceLink 
              resource={pf.resourceType === 'pod' ? Resources.Pods : Resources.Services}
              name={pf.resourceName}
              namespace={pf.namespace}
            />
          </div>
        ),
        Namespace: pf.namespace,
        'Local → Remote': `${pf.localPort} → ${pf.remotePort}`,
        Status: (
          <Status variant={statusVariant as any}>
            {pf.status}
          </Status>
        ),
        Uptime: calculateAge(pf.startTime),
        Actions: (
          <div className="flex items-center space-x-2">
            {pf.status === PortForwardStatus.Active && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => onStop(pf.id)}
                >
                  Stop
                </Button>
                {(isHttp || isHttps) && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => onCopyUrl(pf)}
                    >
                      Copy URL
                    </Button>
                    <Button
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
  }, [portForwards, onStop, onCopyUrl, onOpen, sortConfig]);

  return (
    <ListTable
      headers={['Resource', 'Namespace', 'Local → Remote', 'Status', 'Uptime', 'Actions']}
      rows={rows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};