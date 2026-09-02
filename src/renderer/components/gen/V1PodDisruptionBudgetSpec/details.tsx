import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodDisruptionBudgetSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PodDisruptionBudgetSpecDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudgetSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.maxUnavailable),
        hasValue(resourceData.minAvailable),
        hasValue(resourceData.unhealthyPodEvictionPolicy),
        hasValue(resourceData.selector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Max Unavailable", value: resourceData.maxUnavailable, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Min Available", value: resourceData.minAvailable, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Unhealthy Pod Eviction Policy", value: resourceData.unhealthyPodEvictionPolicy, description: "UnhealthyPodEvictionPolicy defines the criteria for when unhealthy pods should be considered for eviction." },
                ]}
            />

            {hasValue(resourceData.selector) && (
                <Container title="Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.selector } />
                </Container>
            )}

        </>
    )
}
