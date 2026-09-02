import { Container } from "@components/base/container";
import type { V1PodAffinity } from "@kubernetes/client-node";
import { WeightedPodAffinityTermDetails } from "../V1WeightedPodAffinityTerm/details";
import { PodAffinityTermDetails } from "../V1PodAffinityTerm/details";

export const PodAffinityDetails = ({ resourceData }: { resourceData: V1PodAffinity }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.preferredDuringSchedulingIgnoredDuringExecution, resourceData.requiredDuringSchedulingIgnoredDuringExecution].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.preferredDuringSchedulingIgnoredDuringExecution && (
                <Container title="Preferred During Scheduling Ignored During Execution">
                    {resourceData.preferredDuringSchedulingIgnoredDuringExecution.map((item, index) => (
                        <WeightedPodAffinityTermDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.requiredDuringSchedulingIgnoredDuringExecution && (
                <Container title="Required During Scheduling Ignored During Execution">
                    {resourceData.requiredDuringSchedulingIgnoredDuringExecution.map((item, index) => (
                        <PodAffinityTermDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}