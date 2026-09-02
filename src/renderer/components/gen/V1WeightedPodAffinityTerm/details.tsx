import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1WeightedPodAffinityTerm } from "@kubernetes/client-node";
import { PodAffinityTermDetails } from "../V1PodAffinityTerm/details";

export const WeightedPodAffinityTermDetails = ({ resourceData }: { resourceData: V1WeightedPodAffinityTerm }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.weight),
        hasValue(resourceData.podAffinityTerm),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Weight", value: resourceData.weight, description: "weight associated with matching the corresponding podAffinityTerm, in the range 1-100." },
                ]}
            />

            {hasValue(resourceData.podAffinityTerm) && (
                <Container title="Pod Affinity Term" collapsible defaultOpen={ true }>
                    <PodAffinityTermDetails resourceData={resourceData.podAffinityTerm } />
                </Container>
            )}

        </>
    )
}
