import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NetworkPolicyPeer } from "@kubernetes/client-node";
import { IPBlockDetails } from "../V1IPBlock/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const NetworkPolicyPeerDetails = ({ resourceData }: { resourceData: V1NetworkPolicyPeer }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ipBlock),
        hasValue(resourceData.namespaceSelector),
        hasValue(resourceData.podSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.ipBlock) && (
                <Container title="Ip Block" collapsible defaultOpen={ true }>
                    <IPBlockDetails resourceData={resourceData.ipBlock } />
                </Container>
            )}

            {hasValue(resourceData.namespaceSelector) && (
                <Container title="Namespace Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.namespaceSelector } />
                </Container>
            )}

            {hasValue(resourceData.podSelector) && (
                <Container title="Pod Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.podSelector } />
                </Container>
            )}

        </>
    )
}
