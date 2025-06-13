import k8s from '@kubernetes/client-node';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Badge } from '@components/base/badge';

interface Props {
    node?: k8s.V1Node;
}

export const NodeSpec = ({ node }: Props): JSX.Element => {
    if (!node?.spec) return <></>;

    const taints = node.spec.taints || [];
    const unschedulable = node.spec.unschedulable || false;

    return (
        <div className="border p-4 rounded-md border-neutral-800">
            <DescriptionList>
                <DescriptionTerm>Schedulable</DescriptionTerm>
                <DescriptionDetails>
                    <Badge variant={unschedulable ? 'error' : 'success'}>
                        {unschedulable ? 'No' : 'Yes'}
                    </Badge>
                </DescriptionDetails>

                {node.spec.podCIDR && (
                    <>
                        <DescriptionTerm>Pod CIDR</DescriptionTerm>
                        <DescriptionDetails>{node.spec.podCIDR}</DescriptionDetails>
                    </>
                )}

                {node.spec.providerID && (
                    <>
                        <DescriptionTerm>Provider ID</DescriptionTerm>
                        <DescriptionDetails>{node.spec.providerID}</DescriptionDetails>
                    </>
                )}

                {taints.length > 0 && (
                    <>
                        <DescriptionTerm>Taints</DescriptionTerm>
                        <DescriptionDetails>
                            <div className="space-y-1">
                                {taints.map((taint, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {taint.key}{taint.value ? `=${taint.value}` : ''}:{taint.effect}
                                        </Badge>
                                        {taint.timeAdded && (
                                            <span className="text-sm text-zinc-500">
                                                Added: {new Date(taint.timeAdded).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </DescriptionDetails>
                    </>
                )}
            </DescriptionList>
        </div>
    );
};