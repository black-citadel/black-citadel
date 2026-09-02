import { Container } from "@components/base/container";
import type { V1Affinity } from "@kubernetes/client-node";
import { NodeAffinityDetails } from "../V1NodeAffinity/details";
import { PodAffinityDetails } from "../V1PodAffinity/details";
import { PodAntiAffinityDetails } from "../V1PodAntiAffinity/details";

export const AffinityDetails = ({ resourceData }: { resourceData: V1Affinity }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.nodeAffinity, resourceData.podAffinity, resourceData.podAntiAffinity].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.nodeAffinity && (
                <Container title="Node Affinity">
                    <NodeAffinityDetails resourceData={ resourceData.nodeAffinity } />
                </Container>
            )}

            {resourceData.podAffinity && (
                <Container title="Pod Affinity">
                    <PodAffinityDetails resourceData={ resourceData.podAffinity } />
                </Container>
            )}

            {resourceData.podAntiAffinity && (
                <Container title="Pod Anti Affinity">
                    <PodAntiAffinityDetails resourceData={ resourceData.podAntiAffinity } />
                </Container>
            )}

        </>
    )
}