import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NetworkPolicyIngressRule } from "@kubernetes/client-node";
import { NetworkPolicyPortDetails } from "../V1NetworkPolicyPort/details";
import { NetworkPolicyPeerDetails } from "../V1NetworkPolicyPeer/details";

export const NetworkPolicyIngressRuleDetails = ({ resourceData }: { resourceData: V1NetworkPolicyIngressRule }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ports),
        hasValue(resourceData.from),
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

            {hasValue(resourceData.from) && (
                <Container title="From" count={resourceData.from.length} collapsible defaultOpen={ true }>
                    {resourceData.from.map((item, index) => (
                        <PanelListItem key={index}>
                            <NetworkPolicyPeerDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
