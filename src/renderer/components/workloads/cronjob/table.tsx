import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { CronJobResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  cronJobs: k8s.V1CronJobList
}

export const CronJobList = ({ cronJobs }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Schedule', 'Suspend', 'Active', 'LastSchedule', 'Age'];

  const filteredCronJobs = activeNamespace === "all" 
  ? cronJobs.items 
  : cronJobs.items.filter(cronJob => cronJob.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredCronJobs.map(cronJob => ({
    Name: cronJob.metadata.name,
    Namespace: cronJob.metadata.namespace,
    Schedule: cronJob.spec.schedule || 'N/A',
    Suspend: cronJob.spec.suspend ? 'True' : 'False',
    Active: cronJob.status.active?.length || 0,
    LastSchedule: cronJob.status.lastScheduleTime || '',
    Age: cronJob.metadata.creationTimestamp,
    _resource: cronJob // Keep reference to original resource
  }));

  // Sort the data rows
  const sortedCronJobs = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedCronJobs.map(row => {
    const cronJob = row._resource;
    return {
      Name: <CronJobResourceLink name={cronJob.metadata.name} namespace={cronJob.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={cronJob.metadata.namespace} />,
      Schedule: cronJob.spec.schedule || 'N/A',
      Suspend: cronJob.spec.suspend ? 'True' : 'False',
      Active: cronJob.status.active?.length || 0,
      LastSchedule: calculateAge(cronJob.status.lastScheduleTime),
      Age: calculateAge(cronJob.metadata.creationTimestamp)
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