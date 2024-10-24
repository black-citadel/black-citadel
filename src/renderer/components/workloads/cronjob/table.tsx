import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { CronJobResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  cronJobs: k8s.V1CronJobList
}

export const CronJobList = ({ cronJobs }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Schedule', 'Suspend', 'Active', 'LastSchedule', 'Age'];

  const filteredCronJobs = activeNamespace === "all" 
  ? cronJobs.items 
  : cronJobs.items.filter(cronJob => cronJob.metadata.namespace === activeNamespace);

  const processedRows = filteredCronJobs.map(cronJob => ({
    Name: <CronJobResourceLink name={cronJob.metadata.name} namespace={cronJob.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={cronJob.metadata.namespace} />,
    Schedule: cronJob.spec.schedule || 'N/A',
    Suspend: cronJob.spec.suspend ? 'True' : 'False',
    Active: cronJob.status.active?.length || 0,
    LastSchedule: calculateAge(cronJob.status.lastScheduleTime),
    Age: calculateAge(cronJob.metadata.creationTimestamp)
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  )
}