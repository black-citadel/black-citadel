import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NetworkPolicyEgressRule } from "@kubernetes/client-node";
import { NetworkPolicyPortDetails } from "../V1NetworkPolicyPort/details";
import { NetworkPolicyPeerDetails } from "../V1NetworkPolicyPeer/details";

export const NetworkPolicyEgressRuleDetails = ({ resourceData }: { resourceData: V1NetworkPolicyEgressRule }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ports),
        hasValue(resourceData.to),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    {resourceData.ports.map((item, index) => (
                        <PanelListItem key={index}>
                            <NetworkPolicyPortDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.to) && (
                <Container title="To" count={resourceData.to.length} collapsible defaultOpen={ true }>
                    {resourceData.to.map((item, index) => (
                        <PanelListItem key={index}>
                            <NetworkPolicyPeerDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
