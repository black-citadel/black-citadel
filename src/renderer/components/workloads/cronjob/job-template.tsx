import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface JobTemplateProps {
  template: k8s.V1JobTemplateSpec;
}

export const JobTemplate = ({ template }: JobTemplateProps): JSX.Element => {
  return (
    <DetailsItem label="Job Template">
      <DetailsItem label="Parallelism">
        {template.spec.parallelism}
      </DetailsItem>
      <DetailsItem label="Completions">
        {template.spec.completions}
      </DetailsItem>
      <DetailsItem label="Active Deadline Seconds">
        {template.spec.activeDeadlineSeconds}
      </DetailsItem>
      <DetailsItem label="Backoff Limit">
        {template.spec.backoffLimit}
      </DetailsItem>
      {/* You can add more details about the job template here */}
    </DetailsItem>
  );
};
