import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1TopologySpreadConstraint } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const TopologySpreadConstraintDetails = ({ resourceData }: { resourceData: V1TopologySpreadConstraint }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.maxSkew, resourceData.minDomains, resourceData.nodeAffinityPolicy, resourceData.nodeTaintsPolicy, resourceData.topologyKey, resourceData.whenUnsatisfiable].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.labelSelector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Max Skew", value: resourceData.maxSkew },
                    { label: "Min Domains", value: resourceData.minDomains || '-' },
                    { label: "Node Affinity Policy", value: resourceData.nodeAffinityPolicy || '-' },
                    { label: "Node Taints Policy", value: resourceData.nodeTaintsPolicy || '-' },
                    { label: "Topology Key", value: resourceData.topologyKey },
                    { label: "When Unsatisfiable", value: resourceData.whenUnsatisfiable }
                ]}
                columns={1}
            />

            {resourceData.labelSelector && (
                <Container title="Label Selector">
                    <LabelSelectorDetails resourceData={ resourceData.labelSelector } />
                </Container>
            )}

        </>
    )
}