import { useState, useEffect } from 'react';
import { ListHeader } from '@components/list-header';
import { Resources, ResourceAction } from '@utils/enums';
import { EmptyState } from '@components/base/empty-state';
import { Button } from '@protoku/design-system';
import { useView } from '@context/viewProvider';
import { HelmReleaseTable } from '@components/operations/helm/table';
import { HelmChartSearch } from '@components/operations/helm/chart-search';

interface HelmRelease {
  name: string;
  namespace: string;
  revision: string;
  updated: string;
  status: string;
  chart: string;
  app_version: string;
}

export const HelmListView = (): JSX.Element => {
  const [releases, setReleases] = useState<HelmRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const { setViewContext } = useView();

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI.helmList();
      
      if (result.success) {
        setReleases(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to list helm releases');
      }
    } catch (e) {
      console.error('Failed to fetch helm releases:', e);
      setError('Failed to fetch helm releases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
    const intervalId = setInterval(fetchReleases, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleInstallChart = () => {
    setViewContext({
      resource: Resources.Helm,
      action: ResourceAction.Create
    });
  };

  return (
    <>
      <ListHeader
        resource={Resources.Helm}
        error={error}
        showNamespaceDropdown={false}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setShowSearch(!showSearch)}>
              {showSearch ? 'Hide Search' : 'Search Charts'}
            </Button>
            <Button onClick={handleInstallChart}>
              Install Chart
            </Button>
          </div>
        }
      />

      {showSearch && (
        <div className="mb-6">
          <HelmChartSearch onInstall={handleInstallChart} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Loading helm releases...</div>
        </div>
      ) : releases.length === 0 ? (
        <EmptyState
          title="No helm releases found"
          description="Install your first Helm chart to see it listed here."
          action={
            <Button onClick={handleInstallChart}>
              Install Chart
            </Button>
          }
        />
      ) : (
        <HelmReleaseTable releases={releases} onRefresh={fetchReleases} />
      )}
    </>
  );
};