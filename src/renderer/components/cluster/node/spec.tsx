import k8s from '@kubernetes/client-node';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Badge } from '@protoku-bv/design-system';

interface Props {
    node?: k8s.V1Node;
}

export const NodeSpec = ({ node }: Props): JSX.Element => {
    if (!node?.spec) return <></>;

    const unschedulable = node.spec.unschedulable || false;

    return (
        <div>
            <DescriptionList>
                <DescriptionTerm>Schedulable</DescriptionTerm>
                <DescriptionDetails>
                    <Badge variant={unschedulable ? 'red' : 'green'}>
                        {unschedulable ? 'No (Cordoned)' : 'Yes'}
                    </Badge>
                </DescriptionDetails>

                {node.spec.podCIDR && (
                    <>
                        <DescriptionTerm>Pod CIDR</DescriptionTerm>
                        <DescriptionDetails>{node.spec.podCIDR}</DescriptionDetails>
                    </>
                )}

                {node.spec.podCIDRs && node.spec.podCIDRs.length > 0 && (
                    <>
                        <DescriptionTerm>Pod CIDRs</DescriptionTerm>
                        <DescriptionDetails>{node.spec.podCIDRs.join(', ')}</DescriptionDetails>
                    </>
                )}

                {node.spec.providerID && (
                    <>
                        <DescriptionTerm>Provider ID</DescriptionTerm>
                        <DescriptionDetails>{node.spec.providerID}</DescriptionDetails>
                    </>
                )}
            </DescriptionList>
        </div>
    );
};