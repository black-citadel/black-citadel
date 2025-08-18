import { useState, useMemo } from 'react';
import { ListTable, type SortConfig, Status } from '@protoku-bv/design-system';
import { sortRows } from '@utils/sorting';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { calculateAge } from '@utils/helpers';
import { HelmResourceLink } from './resource-link';

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
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'deployed':
      return 'success';
    case 'pending':
    case 'pending-install':
    case 'pending-upgrade':
    case 'pending-rollback':
      return 'warning';
    case 'failed':
    case 'uninstalling':
      return 'error';
    case 'superseded':
    case 'uninstalled':
    default:
      return 'default';
  }
};

const parseHelmDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Helm date format: "2025-07-13 22:25:09.252757997 +0200 CEST"
  // Remove the timezone name (CEST, CET, etc.) at the end
  const cleanedDate = dateString.replace(/\s+[A-Z]{3,4}$/, '');
  
  try {
    const date = new Date(cleanedDate);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const HelmReleaseTable = ({ releases }: HelmReleaseTableProps): JSX.Element => {
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
      Age: release.updated ? (parseHelmDate(release.updated)?.getTime() || 0) : 0,
      _raw: release
    }));

    // Sort the data rows
    const sortedRows = sortRows(dataRows, sortConfig);

    // Map sorted data to React components
    return sortedRows.map((row) => ({
      Name: <HelmResourceLink name={row._raw.name} namespace={row._raw.namespace} />,
      Namespace: <NamespaceResourceLink name={row._raw.namespace} />,
      Status: (
        <Status variant={getStatusVariant(row._raw.status)}>
          {row._raw.status}
        </Status>
      ),
      Chart: row._raw.chart,
      'App Version': row._raw.app_version || '-',
      Revision: row._raw.revision,
      Age: (() => {
        if (!row._raw.updated) return '-';
        const parsedDate = parseHelmDate(row._raw.updated);
        return parsedDate ? calculateAge(parsedDate) : '-';
      })()
    }));
  }, [releases, sortConfig]);

  return (
    <ListTable 
      headers={['Name', 'Namespace', 'Status', 'Chart', 'App Version', 'Revision', 'Age']}
      rows={rows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};