import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku/design-system';
import { StopIcon } from '@heroicons/react/16/solid';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PodResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { Status } from '@protoku/design-system';
import { sortRows } from '@utils/sorting';

interface Props {
  pods: k8s.V1PodList
}

export const PodList = ({ pods }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Containers', 'Status', 'Restarts', 'Ports'];

  const filteredPods = activeNamespace === "all"
    ? pods.items
    : pods.items.filter(pod => pod.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredPods.map(pod => ({
    Name: pod.metadata.name,
    Namespace: pod.metadata.namespace,
    Containers: pod.status?.containerStatuses?.length || 0,
    Status: pod.status?.phase || 'Unknown',
    Restarts: [...(pod.status?.containerStatuses ?? []), ...(pod.status?.initContainerStatuses ?? [])]
      .reduce((sum, status) => sum + (status.restartCount ?? 0), 0),
    Ports: pod.spec?.containers.flatMap(c => c.ports || []).length || 0,
    _pod: pod // Keep reference to original pod
  }));

  // Sort the data rows
  const sortedPods = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedPods.map(row => {
    const pod = row._pod;
    return {
      Name: <PodResourceLink name={pod.metadata.name} namespace={pod.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={pod.metadata.namespace} />,
      Containers: getContainers(pod),
      Status: formatPodStatus(pod.status),
      Restarts: getRestarts(pod),
      Ports: getPorts(pod)
    };
  });

  return (
    <ListTable
      headers={headers}
      rows={processedRows}
      sortConfig={sortConfig}
      onSort={setSortConfig}
    />
  )
}

const formatPodStatus = (status: k8s.V1PodStatus): JSX.Element => {
  const phase = status.phase || 'Unknown';
  
  // Map pod phases to Status variants
  switch (phase) {
    case 'Running':
      return <Status variant="success">{phase}</Status>;
    case 'Succeeded':
      return <Status variant="success">{phase}</Status>;
    case 'Failed':
      return <Status variant="error">{phase}</Status>;
    case 'Pending':
      return <Status variant="warning">{phase}</Status>;
    case 'Unknown':
      return <Status variant="default">{phase}</Status>;
    default:
      return <Status variant="default">{phase}</Status>;
  }
};

const getRestarts = (pod: k8s.V1Pod): React.ReactNode => {
  const allContainerStatuses = [
    ...(pod.status?.containerStatuses ?? []),
    ...(pod.status?.initContainerStatuses ?? [])
  ];

  const totalRestarts = allContainerStatuses.reduce((sum, status) => sum + (status.restartCount ?? 0), 0);

  return (
    <>
      {totalRestarts}
    </>
  );
};


const getContainers = (pod: k8s.V1Pod): React.ReactNode => {
  const allContainerStatuses = [
    ...(pod.status?.containerStatuses ?? []),
    ...(pod.status?.initContainerStatuses ?? [])
  ];

  return (
    <>
      {allContainerStatuses.map((status, index) => {
        const isRunning = status.state?.running != null;
        return (
          <StopIcon
            key={index}
            className={`h-4 w-4 inline ${isRunning ? 'text-green-500' : 'text-neutral-500'}`}
            title={`${status.name} (${isRunning ? 'Running' : 'Stopped'})`}
          />
        );
      })}
    </>
  );
};

const getPorts = (pod: k8s.V1Pod): React.ReactNode => {
  return (
    <ul>
      {pod.spec?.containers.flatMap((container, containerIndex) =>
        container.ports?.map((port, portIndex) => (
          <li key={`${containerIndex}-${portIndex}`}>
            {port.containerPort}
            {port.protocol && `/${port.protocol}`}
            {port.name && <span className="text-zinc-600"> ({port.name})</span>}
          </li>
        )) ?? []
      )}
    </ul>
  );
};