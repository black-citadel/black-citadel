import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1NetworkPolicyIngressRule, V1NetworkPolicyPeer, V1NetworkPolicyPort } from "@utils/k8s-types";
import { NetworkPolicyPeerDetails } from "../V1NetworkPolicyPeer/details";
import { NetworkPolicyPortDetails } from "../V1NetworkPolicyPort/details";

export const NetworkPolicyIngressRuleDetails = ({ resourceData }: { resourceData: V1NetworkPolicyIngressRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData._from, resourceData.ports].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData._from && (
                <Container title="_from">
                    {resourceData._from.map((item, index) => (
                        <NetworkPolicyPeerDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.ports && (
                <Container title="Ports">
                    {resourceData.ports.map((item, index) => (
                        <NetworkPolicyPortDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}