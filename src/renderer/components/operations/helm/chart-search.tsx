import { useState, useMemo } from 'react';
import { Button, ListTable } from '@protoku/design-system';
import { Input } from '@components/base/input';

interface HelmChart {
  name: string;
  version: string;
  app_version: string;
  description: string;
}

interface HelmChartSearchProps {
  onInstall: (chart: string) => void;
}

export const HelmChartSearch = ({ onInstall }: HelmChartSearchProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [charts, setCharts] = useState<HelmChart[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() && !searched) return;
    
    setLoading(true);
    try {
      const result = await window.electronAPI.helmSearchRepo(searchTerm.trim() || undefined);
      if (result.success) {
        setCharts(result.data || []);
        setSearched(true);
      }
    } catch (e) {
      console.error('Failed to search helm charts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const rows = useMemo(() => {
    return charts.map((chart) => ({
      Chart: <span className="font-medium text-white">{chart.name}</span>,
      'Chart Version': chart.version,
      'App Version': chart.app_version || '-',
      Description: <span className="text-gray-400 text-sm">{chart.description}</span>,
      Actions: (
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onInstall(chart.name);
          }}
        >
          Install
        </Button>
      )
    }));
  }, [charts, onInstall]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for helm charts (e.g., nginx, postgres)"
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {searched && (
        <>
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Searching helm repositories...
            </div>
          ) : charts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No charts found. Try searching for "nginx" or add more helm repositories.
            </div>
          ) : (
            <ListTable 
              headers={['Chart', 'Chart Version', 'App Version', 'Description', 'Actions']}
              rows={rows} 
            />
          )}
        </>
      )}
    </div>
  );
};