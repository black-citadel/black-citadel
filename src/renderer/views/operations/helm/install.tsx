import { useState, useEffect } from 'react';
import { CreateHeader } from '@components/create-header';
import { Resources, ResourceAction } from '@utils/enums';
import { Button, Select, SelectOption } from '@protoku-bv/design-system';
import { Input } from '@components/base/input';
import { useView } from '@context/viewProvider';

interface HelmChart {
  name: string;
  version: string;
  app_version: string;
  description: string;
}

const defaultValues = `# Override default values for the chart
# Example:
# replicaCount: 2
# image:
#   repository: nginx
#   tag: "1.21.0"
#   pullPolicy: IfNotPresent`;

export const HelmInstallView = (): JSX.Element => {
  const chartParam: string | null = null; // Can be enhanced to pass chart via context
  const [chart, setChart] = useState(chartParam || '');
  const [releaseName, setReleaseName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [values, setValues] = useState(defaultValues);
  const [namespaces, setNamespaces] = useState<string[]>(['default']);
  const [availableCharts, setAvailableCharts] = useState<HelmChart[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setViewContext } = useView();

  useEffect(() => {
    // Fetch namespaces
    const fetchNamespaces = async () => {
      try {
        const result = await window.electronAPI.listNamespace();
        const nsNames = result.items.map(ns => ns.metadata?.name || '').filter(Boolean);
        setNamespaces(nsNames);
      } catch (e) {
        console.error('Failed to fetch namespaces:', e);
      }
    };

    fetchNamespaces();
  }, []);

  useEffect(() => {
    // Fetch available charts
    const fetchCharts = async () => {
      setLoadingCharts(true);
      try {
        const result = await window.electronAPI.helmSearchRepo();
        if (result.success) {
          setAvailableCharts(result.data || []);
        }
      } catch (e) {
        console.error('Failed to fetch helm charts:', e);
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchCharts();
  }, []);

  const handleInstall = async () => {
    if (!chart || !releaseName) {
      setError('Please provide both chart and release name');
      return;
    }

    setInstalling(true);
    setError(null);

    try {
      const result = await window.electronAPI.helmInstall(
        releaseName,
        chart,
        namespace,
        values !== defaultValues ? values : undefined
      );

      if (result.success) {
        setViewContext({
          resource: Resources.Helm,
          action: ResourceAction.List
        });
      } else {
        setError(result.error || 'Failed to install helm chart');
      }
    } catch (e) {
      console.error('Failed to install helm chart:', e);
      setError('Failed to install helm chart');
    } finally {
      setInstalling(false);
    }
  };

  const suggestedReleaseName = chart ? chart.split('/').pop()?.toLowerCase() : '';

  const chartOptions: SelectOption<string>[] = [
    { value: '', label: 'Select a chart' },
    ...availableCharts.map((c) => ({
      value: c.name,
      label: `${c.name} (${c.version}) - ${c.description}`
    }))
  ];

  const namespaceOptions: SelectOption<string>[] = namespaces.map((ns) => ({
    value: ns,
    label: ns
  }));

  return (
    <>
      <CreateHeader error={error}>
        Install Helm Chart
      </CreateHeader>

      <div className="space-y-6 max-w-4xl">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Chart
          </label>
          {loadingCharts ? (
            <div className="text-gray-400">Loading available charts...</div>
          ) : availableCharts.length > 0 ? (
            <Select
              name="chart"
              value={chart}
              onChange={(value: string) => setChart(value)}
              options={chartOptions}
              placeholder="Select a chart"
              disabled={installing}
            />
          ) : (
            <Input
              value={chart}
              onChange={(e) => setChart(e.target.value)}
              placeholder="e.g., bitnami/nginx or stable/prometheus"
              disabled={installing}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Release Name
          </label>
          <Input
            value={releaseName}
            onChange={(e) => setReleaseName(e.target.value)}
            placeholder={suggestedReleaseName || 'my-release'}
            disabled={installing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Namespace
          </label>
          <Select
            name="namespace"
            value={namespace}
            onChange={(value: string) => setNamespace(value)}
            options={namespaceOptions}
            placeholder="Select namespace"
            disabled={installing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Values (Optional)
          </label>
          <textarea
            value={values}
            onChange={(e) => setValues(e.target.value)}
            disabled={installing}
            className="w-full h-96 px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="# Override default values for the chart"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleInstall}
            disabled={installing || !chart || !releaseName}
          >
            {installing ? 'Installing...' : 'Install'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={installing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};