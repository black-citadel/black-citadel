import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface CronJobStatusProps {
  status: k8s.V1CronJobStatus;
}

export const CronJobStatus = ({ status }: CronJobStatusProps): JSX.Element => {
  return (
    <DetailsItem label="Status">
      <DetailsItem label="Active">
        {status.active?.length || 0} job(s)
      </DetailsItem>
      <DetailsItem label="Last Schedule Time">
        {status.lastScheduleTime ? new Date(status.lastScheduleTime).toLocaleString() : 'N/A'}
      </DetailsItem>
      <DetailsItem label="Last Successful Time">
        {status.lastSuccessfulTime ? new Date(status.lastSuccessfulTime).toLocaleString() : 'N/A'}
      </DetailsItem>
    </DetailsItem>
  );
};