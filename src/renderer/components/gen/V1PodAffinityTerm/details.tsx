import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PodAffinityTerm } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PodAffinityTermDetails = ({ resourceData }: { resourceData: V1PodAffinityTerm }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.topologyKey].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.labelSelector, resourceData.namespaceSelector].some(v => v !== undefined && v !== null));
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
                    { label: "Topology Key", value: resourceData.topologyKey }
                ]}
                columns={1}
            />

            {resourceData.labelSelector && (
                <Container title="Label Selector">
                    <LabelSelectorDetails resourceData={ resourceData.labelSelector } />
                </Container>
            )}

            {resourceData.namespaceSelector && (
                <Container title="Namespace Selector">
                    <LabelSelectorDetails resourceData={ resourceData.namespaceSelector } />
                </Container>
            )}

        </>
    )
}