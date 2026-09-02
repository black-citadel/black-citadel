import { Container } from "@components/base/container";
import type { V1NetworkPolicyIngressRule } from "@kubernetes/client-node";
import { NetworkPolicyPeerDetails } from "../V1NetworkPolicyPeer/details";
import { NetworkPolicyPortDetails } from "../V1NetworkPolicyPort/details";

export const NetworkPolicyIngressRuleDetails = ({ resourceData }: { resourceData: V1NetworkPolicyIngressRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.from, resourceData.ports].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.from && (
                <Container title="From">
                    {resourceData.from.map((item, index) => (
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