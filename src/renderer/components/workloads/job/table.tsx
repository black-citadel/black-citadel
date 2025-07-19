import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getCompletions, getDuration } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { JobResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';
import { useState } from 'react';
import { SortConfig, sortRows } from '@utils/sorting';

interface Props {
  jobs: k8s.V1JobList
}

export const JobList = ({ jobs }: Props): JSX.Element => {
  const { activeNamespace } = useView();
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(undefined);

  const headers = ['Name', 'Namespace', 'Completions', 'Duration', 'Age'];

  const filteredJobs = activeNamespace === "all" 
  ? jobs.items 
  : jobs.items.filter(job => job.metadata.namespace === activeNamespace);

  // First, create rows with raw data for sorting
  const dataRows = filteredJobs.map(job => ({
    Name: job.metadata.name,
    Namespace: job.metadata.namespace,
    Completions: `${job.status.succeeded || 0}/${job.spec.completions || 1}`,
    Duration: job.status.startTime ? (job.status.completionTime ? 
      new Date(job.status.completionTime).getTime() - new Date(job.status.startTime).getTime() : -1) : -1,
    Age: job.metadata.creationTimestamp,
    _resource: job // Keep reference to original resource
  }));

  // Sort the data rows
  const sortedJobs = sortRows(dataRows, sortConfig);

  // Then map to React components after sorting
  const processedRows = sortedJobs.map(row => {
    const job = row._resource;
    return {
      Name: <JobResourceLink name={job.metadata.name} namespace={job.metadata.namespace} />,
      Namespace: <NamespaceResourceLink name={job.metadata.namespace} />,
      Completions: getCompletions(job.status.succeeded || 0, job.spec.completions || 1),
      Duration: getDuration(job.status.startTime, job.status.completionTime),
      Age: calculateAge(job.metadata.creationTimestamp)
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