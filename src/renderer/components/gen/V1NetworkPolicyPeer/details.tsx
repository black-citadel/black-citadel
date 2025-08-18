import { Container } from "@components/base/container";
import { V1NetworkPolicyPeer } from "@utils/k8s-types";
import { IPBlockDetails } from "../V1IPBlock/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const NetworkPolicyPeerDetails = ({ resourceData }: { resourceData: V1NetworkPolicyPeer }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.ipBlock, resourceData.namespaceSelector, resourceData.podSelector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.ipBlock && (
                <Container title="Ip Block">
                    <IPBlockDetails resourceData={ resourceData.ipBlock } />
                </Container>
            )}

            {resourceData.namespaceSelector && (
                <Container title="Namespace Selector">
                    <LabelSelectorDetails resourceData={ resourceData.namespaceSelector } />
                </Container>
            )}

            {resourceData.podSelector && (
                <Container title="Pod Selector">
                    <LabelSelectorDetails resourceData={ resourceData.podSelector } />
                </Container>
            )}

        </>
    )
}