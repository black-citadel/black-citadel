import k8s = require('@kubernetes/client-node');
import { DetailsAnnotations } from "@components/details-item";
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Subheading } from '@components/base/heading';
import { calculateAge } from '@utils/helpers';

interface Props {
  metadata: k8s.V1ObjectMeta;
}

export const MetadataDetails = ({ metadata }: Props): JSX.Element => {
  return (
    <>
      <Subheading className='mt-8 mb-4'>Metadata</Subheading>
      <div className="grid grid-cols-2 gap-4">
        <div className='border border-dotted border-neutral-800 p-4'>
          <DescriptionList>

            {metadata.namespace && <>
              <DescriptionTerm>Namespace</DescriptionTerm>
              <DescriptionDetails><NamespaceResourceLink name={metadata.namespace} /></DescriptionDetails>
            </>}

            <DescriptionTerm>Labels</DescriptionTerm>
            <DescriptionDetails>
              {metadata.labels && (
                <>
                  {Object.entries(metadata.labels).map(([key, value]) => (
                    <div key={key}>
                      <span className="bg-neutral-900 py-0.5 px-2 mb-2 rounded text-xs">
                        {key}: {value}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </DescriptionDetails>


          </DescriptionList>
        </div>
        <div className='border border-dotted border-neutral-800 p-4'>
          <DescriptionList>
          <DescriptionTerm>Age</DescriptionTerm>
          <DescriptionDetails>{calculateAge(metadata.creationTimestamp)}</DescriptionDetails>

            <DescriptionTerm>Annotations</DescriptionTerm>
            <DescriptionDetails>
              <DetailsAnnotations annotations={metadata.annotations} />
            </DescriptionDetails>
          </DescriptionList>
        </div>
      </div>
    </>
  );
};