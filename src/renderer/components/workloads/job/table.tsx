import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge, getCompletions, getDuration } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { JobResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  jobs: k8s.V1JobList
}

export const JobList = ({ jobs }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Completions', 'Duration', 'Age'];

  const filteredJobs = activeNamespace === "all" 
  ? jobs.items 
  : jobs.items.filter(job => job.metadata.namespace === activeNamespace);

  const processedRows = filteredJobs.map(job => ({
    Name: <JobResourceLink name={job.metadata.name} namespace={job.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={job.metadata.namespace} />,
    Completions: getCompletions(job.status.succeeded || 0, job.spec.completions || 1),
    Duration: getDuration(job.status.startTime, job.status.completionTime),
    Age: calculateAge(job.metadata.creationTimestamp)
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}