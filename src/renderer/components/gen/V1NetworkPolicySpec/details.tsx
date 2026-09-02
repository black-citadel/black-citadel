import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NetworkPolicySpec } from "@kubernetes/client-node";
import { NetworkPolicyEgressRuleDetails } from "../V1NetworkPolicyEgressRule/details";
import { NetworkPolicyIngressRuleDetails } from "../V1NetworkPolicyIngressRule/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const NetworkPolicySpecDetails = ({ resourceData }: { resourceData: V1NetworkPolicySpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.policyTypes),
        hasValue(resourceData.egress),
        hasValue(resourceData.ingress),
        hasValue(resourceData.podSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Policy Types", value: resourceData.policyTypes, description: "policyTypes is a list of rule types that the NetworkPolicy relates to." },
                ]}
            />

            {hasValue(resourceData.egress) && (
                <Container title="Egress" count={resourceData.egress.length} collapsible defaultOpen={ true }>
                    {resourceData.egress.map((item, index) => (
                        <PanelListItem key={index}>
                            <NetworkPolicyEgressRuleDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ingress) && (
                <Container title="Ingress" count={resourceData.ingress.length} collapsible defaultOpen={ true }>
                    {resourceData.ingress.map((item, index) => (
                        <PanelListItem key={index}>
                            <NetworkPolicyIngressRuleDetails resourceData={item} />
                        </PanelListItem>
                    ))}
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
