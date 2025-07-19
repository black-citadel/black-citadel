import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { ServiceResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  services: k8s.V1ServiceList
}

export const ServiceList = ({ services }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Type', 'Cluster IP', 'External IP', 'Ports'];

  const filteredServices = activeNamespace === "all" 
  ? services.items 
  : services.items.filter(service => service.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredServices.map(service => ({
    Name: service.metadata.name,
    Namespace: service.metadata.namespace,
    Type: getServiceType(service),
    'Cluster IP': getClusterIP(service),
    'External IP': getExternalIP(service),
    Ports: service.spec?.ports?.length || 0,
    _service: service // Keep reference to original service
  }));

  // Sort the data rows
  const sortedServices = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedServices.map(row => {
    const service = row._service;
    return {
      Name: <ServiceResourceLink name={service.metadata.name} namespace={service.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={service.metadata.namespace} />,
      Type: getServiceType(service),
      'Cluster IP': getClusterIP(service),
      'External IP': getExternalIP(service),
      Ports: getPorts(service)
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

export const getServiceType = (service: k8s.V1Service): string => {
  return service.spec.type || 'ClusterIP';
};

export const getClusterIP = (service: k8s.V1Service): string => {
  return service.spec.clusterIP || 'None';
};

export const getExternalIP = (service: k8s.V1Service): string => {
  if (service.spec.type === 'LoadBalancer' && service.status.loadBalancer.ingress) {
    return service.status.loadBalancer.ingress[0].ip || 'Pending';
  }
  return '-';
};

export const getPorts = (service: k8s.V1Service): React.ReactNode => {
  if (!service.spec || !service.spec.ports || service.spec.ports.length === 0) {
    return '';
  }

  return (
    <ul>
      {service.spec.ports.map((port, index) => (
        <li key={index}>
          {port.port}
          {port.protocol && `/${port.protocol}`}
          {port.name && <span className='text-zinc-600'> ({port.name})</span>}
        </li>
      ))}
    </ul>
  );
};