import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1TopologySpreadConstraint } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const TopologySpreadConstraintDetails = ({ resourceData }: { resourceData: V1TopologySpreadConstraint }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.matchLabelKeys),
        hasValue(resourceData.maxSkew),
        hasValue(resourceData.minDomains),
        hasValue(resourceData.nodeAffinityPolicy),
        hasValue(resourceData.nodeTaintsPolicy),
        hasValue(resourceData.topologyKey),
        hasValue(resourceData.whenUnsatisfiable),
        hasValue(resourceData.labelSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Match Label Keys", value: resourceData.matchLabelKeys, description: "MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated." },
                    { label: "Max Skew", value: resourceData.maxSkew, description: "MaxSkew describes the degree to which pods may be unevenly distributed." },
                    { label: "Min Domains", value: resourceData.minDomains, description: "MinDomains indicates a minimum number of eligible domains." },
                    { label: "Node Affinity Policy", value: resourceData.nodeAffinityPolicy, description: "NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew." },
                    { label: "Node Taints Policy", value: resourceData.nodeTaintsPolicy, description: "NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew." },
                    { label: "Topology Key", value: resourceData.topologyKey, description: "TopologyKey is the key of node labels." },
                    { label: "When Unsatisfiable", value: resourceData.whenUnsatisfiable, description: "WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint." },
                ]}
            />

            {hasValue(resourceData.labelSelector) && (
                <Container title="Label Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.labelSelector } />
                </Container>
            )}

        </>
    )
}
