import { useMemo } from 'react';
import { ListTable } from '@components/list-table';
import { useView } from '@context/viewProvider';
import { Resources, ResourceAction } from '@utils/enums';
import { HelmStatusBadge } from './badge';

interface HelmRelease {
  name: string;
  namespace: string;
  revision: string;
  updated: string;
  status: string;
  chart: string;
  app_version: string;
}

interface HelmReleaseTableProps {
  releases: HelmRelease[];
  onRefresh?: () => void;
}

export const HelmReleaseTable = ({ releases, onRefresh }: HelmReleaseTableProps): JSX.Element => {
  const { setViewContext } = useView();

  const rows = useMemo(() => {
    return releases.map((release) => ({
      Name: (
        <span 
          className="font-medium text-white cursor-pointer hover:text-blue-400"
          onClick={() => setViewContext({
            resource: Resources.Helm,
            action: ResourceAction.Details,
            name: release.name,
            namespace: release.namespace
          })}
        >
          {release.name}
        </span>
      ),
      Namespace: release.namespace,
      Status: <HelmStatusBadge status={release.status} />,
      Chart: release.chart,
      'App Version': release.app_version || '-',
      Revision: release.revision,
      Updated: new Date(release.updated).toLocaleString()
    }));
  }, [releases, setViewContext]);

  return (
    <ListTable 
      headers={['Name', 'Namespace', 'Status', 'Chart', 'App Version', 'Revision', 'Updated']}
      rows={rows} 
    />
  );
};