import { Container } from "@components/base/container";
import { V1NetworkPolicySpec } from "@utils/k8s-types";
import { NetworkPolicyEgressRuleDetails } from "../V1NetworkPolicyEgressRule/details";
import { NetworkPolicyIngressRuleDetails } from "../V1NetworkPolicyIngressRule/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const NetworkPolicySpecDetails = ({ resourceData }: { resourceData: V1NetworkPolicySpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.egress, resourceData.ingress, resourceData.podSelector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.egress && (
                <Container title="Egress">
                    {resourceData.egress.map((item, index) => (
                        <NetworkPolicyEgressRuleDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.ingress && (
                <Container title="Ingress">
                    {resourceData.ingress.map((item, index) => (
                        <NetworkPolicyIngressRuleDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            <Container title="Pod Selector">
                <LabelSelectorDetails resourceData={ resourceData.podSelector } />
            </Container>

        </>
    )
}