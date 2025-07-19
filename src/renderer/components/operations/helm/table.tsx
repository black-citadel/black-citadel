import { useState, useMemo } from 'react';
import { ListTable } from '@components/list-table';
import { useView } from '@context/viewProvider';
import { Resources, ResourceAction } from '@utils/enums';
import { SortConfig, sortRows } from '@utils/sorting';
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
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const rows = useMemo(() => {
    // Create data rows with raw values for sorting
    const dataRows = releases.map(release => ({
      Name: release.name,
      Namespace: release.namespace,
      Status: release.status,
      Chart: release.chart,
      'App Version': release.app_version || '-',
      Revision: parseInt(release.revision) || 0,
      Updated: release.updated,
      _raw: release
    }));

    // Sort the data rows
    const sortedRows = sortRows(dataRows, sortConfig);

    // Map sorted data to React components
    return sortedRows.map((row) => ({
      Name: (
        <span 
          className="font-medium text-white cursor-pointer hover:text-blue-400"
          onClick={() => setViewContext({
            resource: Resources.Helm,
            action: ResourceAction.Details,
            name: row._raw.name,
            namespace: row._raw.namespace
          })}
        >
          {row._raw.name}
        </span>
      ),
      Namespace: row._raw.namespace,
      Status: <HelmStatusBadge status={row._raw.status} />,
      Chart: row._raw.chart,
      'App Version': row._raw.app_version || '-',
      Revision: row._raw.revision,
      Updated: new Date(row._raw.updated).toLocaleString()
    }));
  }, [releases, setViewContext, sortConfig]);

  return (
    <ListTable 
      headers={['Name', 'Namespace', 'Status', 'Chart', 'App Version', 'Revision', 'Updated']}
      rows={rows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};