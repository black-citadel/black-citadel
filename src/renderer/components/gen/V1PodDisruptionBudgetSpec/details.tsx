import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PodDisruptionBudgetSpec } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PodDisruptionBudgetSpecDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudgetSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.maxUnavailable, resourceData.minAvailable, resourceData.unhealthyPodEvictionPolicy].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.selector].some(v => v !== undefined && v !== null));
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
                    { label: "Max Unavailable", value: resourceData.maxUnavailable || '-' },
                    { label: "Min Available", value: resourceData.minAvailable || '-' },
                    { label: "Unhealthy Pod Eviction Policy", value: resourceData.unhealthyPodEvictionPolicy || '-' }
                ]}
                columns={1}
            />

            {resourceData.selector && (
                <Container title="Selector">
                    <LabelSelectorDetails resourceData={ resourceData.selector } />
                </Container>
            )}

        </>
    )
}