import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { StopIcon } from '@heroicons/react/16/solid';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { PodResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';

interface Props {
  pods: k8s.V1PodList
}

export const PodList = ({ pods }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const headers = ['Name', 'Namespace', 'Containers', 'Status', 'Restarts', 'Ports'];

  const filteredPods = activeNamespace === "all"
    ? pods.items
    : pods.items.filter(pod => pod.metadata.namespace === activeNamespace);

  const sortedPods = [...filteredPods].sort((a, b) => {
    if (!sortDirection) return 0;
    const nameA = a.metadata.name.toLowerCase();
    const nameB = b.metadata.name.toLowerCase();
    return sortDirection === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const processedRows = sortedPods.map(pod => ({
    Name: <PodResourceLink name={pod.metadata.name} namespace={pod.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={pod.metadata.namespace} />,
    Containers: getContainers(pod),
    Status: pod.status.phase,
    Restarts: getRestarts(pod),
    Ports: getPorts(pod)
  }));

  return (
    <ListTable
      headers={headers}
      rows={processedRows}
      sortDirection={sortDirection}
      onSort={setSortDirection}
    />
  )
}

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