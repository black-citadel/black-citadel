import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ConfigMapResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  configMaps: k8s.V1ConfigMapList;
}

export const ConfigMapList = ({ configMaps }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Data', 'Age'];

  const filteredConfigMaps = activeNamespace === "all" 
  ? configMaps.items 
  : configMaps.items.filter(configMap => configMap.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredConfigMaps.map(configMap => ({
    Name: configMap.metadata.name,
    Namespace: configMap.metadata.namespace,
    Data: getConfigMapDataCount(configMap.data, configMap.binaryData),
    Age: configMap.metadata.creationTimestamp 
      ? new Date(configMap.metadata.creationTimestamp).getTime()
      : 0,
    _configMap: configMap // Keep reference to original configMap
  }));

  // Sort the data rows
  const sortedConfigMaps = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedConfigMaps.map(row => {
    const configMap = row._configMap;
    return {
      Name: <ConfigMapResourceLink name={configMap.metadata.name} namespace={configMap.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={configMap.metadata.namespace} />,
      Data: formatConfigMapData(configMap.data, configMap.binaryData),
      Age: configMap.metadata.creationTimestamp 
        ? calculateAge(new Date(configMap.metadata.creationTimestamp))
        : 'N/A'
    };
  });

  return (
    <ListTable 
      headers={headers} 
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  );
};

// Helper function to get ConfigMap data count for sorting
const getConfigMapDataCount = (
  data: { [key: string]: string } | undefined, 
  binaryData: { [key: string]: string } | undefined
): number => {
  const dataCount = data ? Object.keys(data).length : 0;
  const binaryDataCount = binaryData ? Object.keys(binaryData).length : 0;
  return dataCount + binaryDataCount;
};

// Helper function to format ConfigMap data
const formatConfigMapData = (
  data: { [key: string]: string } | undefined, 
  binaryData: { [key: string]: string } | undefined
): string => {
  const dataCount = data ? Object.keys(data).length : 0;
  const binaryDataCount = binaryData ? Object.keys(binaryData).length : 0;
  const totalCount = dataCount + binaryDataCount;

  if (totalCount === 0) return '';

  const parts = [];
  if (dataCount > 0) parts.push(`${dataCount} item${dataCount !== 1 ? 's' : ''}`);
  if (binaryDataCount > 0) parts.push(`${binaryDataCount} binary item${binaryDataCount !== 1 ? 's' : ''}`);

  return parts.join(', ');
};