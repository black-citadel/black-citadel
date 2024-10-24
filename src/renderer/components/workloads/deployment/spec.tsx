import k8s = require('@kubernetes/client-node');
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Subheading } from '@components/base/heading';
import { DetailsItem } from '@components/details-item';

interface Props {
  spec: k8s.V1DeploymentSpec;
}

export const DeploymentSpec = ({ spec }: Props): JSX.Element => {
  return (
    <>
      <Subheading className='mt-8 mb-4'>Configuration</Subheading>

      <div className="grid grid-cols-5 gap-4">
        <DetailsItem label="Min Ready Seconds">
          {spec.minReadySeconds}
        </DetailsItem>

        <DetailsItem label="Paused">
          {spec.paused}
        </DetailsItem>

        <DetailsItem label="Progress Deadline Seconds">
          {spec.progressDeadlineSeconds}
        </DetailsItem>

        <DetailsItem label="Replicas">
          {spec.replicas}
        </DetailsItem>

        <DetailsItem label="Revision History Limit">
          {spec.revisionHistoryLimit}
        </DetailsItem>
      </div >
    </>
  );
};