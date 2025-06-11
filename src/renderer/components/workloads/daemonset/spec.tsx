import k8s = require('@kubernetes/client-node');
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Subheading } from '@components/base/heading';
import { DetailsItem } from '@components/details-item';

interface Props {
  spec: k8s.V1DaemonSetSpec;
}

export const DaemonSetSpec = ({ spec }: Props): JSX.Element => {
  return (
    <>
      <Subheading className='mt-8 mb-4'>Configuration</Subheading>

      <div className="grid grid-cols-5 gap-4">
        <DetailsItem label="Min Ready Seconds">
          {spec.minReadySeconds || 0}
        </DetailsItem>

        <DetailsItem label="Revision History Limit">
          {spec.revisionHistoryLimit || 10}
        </DetailsItem>
      </div>

      {spec.selector && (
        <>
          <Subheading className='mt-8 mb-4'>Selector</Subheading>
          <DescriptionList>
            {spec.selector.matchLabels && Object.entries(spec.selector.matchLabels).map(([key, value]) => (
              <div key={key}>
                <DescriptionTerm>{key}</DescriptionTerm>
                <DescriptionDetails>{value}</DescriptionDetails>
              </div>
            ))}
          </DescriptionList>
        </>
      )}
    </>
  );
};