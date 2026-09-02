import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Affinity } from "@kubernetes/client-node";
import { NodeAffinityDetails } from "../V1NodeAffinity/details";
import { PodAffinityDetails } from "../V1PodAffinity/details";
import { PodAntiAffinityDetails } from "../V1PodAntiAffinity/details";

export const AffinityDetails = ({ resourceData }: { resourceData: V1Affinity }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.nodeAffinity),
        hasValue(resourceData.podAffinity),
        hasValue(resourceData.podAntiAffinity),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.nodeAffinity) && (
                <Container title="Node Affinity" collapsible defaultOpen={ true }>
                    <NodeAffinityDetails resourceData={resourceData.nodeAffinity } />
                </Container>
            )}

            {hasValue(resourceData.podAffinity) && (
                <Container title="Pod Affinity" collapsible defaultOpen={ true }>
                    <PodAffinityDetails resourceData={resourceData.podAffinity } />
                </Container>
            )}

            {hasValue(resourceData.podAntiAffinity) && (
                <Container title="Pod Anti Affinity" collapsible defaultOpen={ true }>
                    <PodAntiAffinityDetails resourceData={resourceData.podAntiAffinity } />
                </Container>
            )}

        </>
    )
}
