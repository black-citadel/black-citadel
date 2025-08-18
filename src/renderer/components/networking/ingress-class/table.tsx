import k8s = require('@kubernetes/client-node');
import { ListTable, type SortConfig } from '@protoku-bv/design-system';
import { calculateAge } from '@utils/helpers';
import { IngressClassResourceLink } from './resource-link';
import { useState } from 'react';
import { sortRows } from '@utils/sorting';

interface Props {
  ingressClasses: k8s.V1IngressClassList;
}

export const IngressClassList = ({ ingressClasses }: Props): JSX.Element => {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);
  
  const headers = ['Name', 'Controller', 'Parameters', 'Age'];

  // First, create rows with raw data for sorting
  const dataRows = ingressClasses.items.map(ingressClass => ({
    Name: ingressClass.metadata.name,
    Controller: ingressClass.spec?.controller || '-',
    Parameters: ingressClass.spec?.parameters ? JSON.stringify(ingressClass.spec.parameters) : '-',
    Age: ingressClass.metadata.creationTimestamp ? new Date(ingressClass.metadata.creationTimestamp).getTime() : 0,
    _ingressClass: ingressClass // Keep reference to original ingress class
  }));

  // Sort the data rows
  const sortedIngressClasses = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedIngressClasses.map(row => {
    const ingressClass = row._ingressClass;
    return {
      Name: <IngressClassResourceLink name={ingressClass.metadata.name} namespace={ingressClass.metadata.namespace} />,
      Controller: ingressClass.spec?.controller || '-',
      Parameters: ingressClass.spec?.parameters ? JSON.stringify(ingressClass.spec.parameters) : '-',
      Age: ingressClass.metadata.creationTimestamp 
        ? calculateAge(new Date(ingressClass.metadata.creationTimestamp))
        : '-'
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