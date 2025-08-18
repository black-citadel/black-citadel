import { Container } from "@components/base/container";
import { V1NetworkPolicyEgressRule } from "@utils/k8s-types";
import { NetworkPolicyPortDetails } from "../V1NetworkPolicyPort/details";
import { NetworkPolicyPeerDetails } from "../V1NetworkPolicyPeer/details";

export const NetworkPolicyEgressRuleDetails = ({ resourceData }: { resourceData: V1NetworkPolicyEgressRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.ports, resourceData.to].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.ports && (
                <Container title="Ports">
                    {resourceData.ports.map((item, index) => (
                        <NetworkPolicyPortDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.to && (
                <Container title="To">
                    {resourceData.to.map((item, index) => (
                        <NetworkPolicyPeerDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}