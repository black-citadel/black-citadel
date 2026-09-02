import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodAffinity } from "@kubernetes/client-node";
import { WeightedPodAffinityTermDetails } from "../V1WeightedPodAffinityTerm/details";
import { PodAffinityTermDetails } from "../V1PodAffinityTerm/details";

export const PodAffinityDetails = ({ resourceData }: { resourceData: V1PodAffinity }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.preferredDuringSchedulingIgnoredDuringExecution),
        hasValue(resourceData.requiredDuringSchedulingIgnoredDuringExecution),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.preferredDuringSchedulingIgnoredDuringExecution) && (
                <Container title="Preferred During Scheduling Ignored During Execution" count={resourceData.preferredDuringSchedulingIgnoredDuringExecution.length} collapsible defaultOpen={ true }>
                    {resourceData.preferredDuringSchedulingIgnoredDuringExecution.map((item, index) => (
                        <PanelListItem key={index}>
                            <WeightedPodAffinityTermDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.requiredDuringSchedulingIgnoredDuringExecution) && (
                <Container title="Required During Scheduling Ignored During Execution" count={resourceData.requiredDuringSchedulingIgnoredDuringExecution.length} collapsible defaultOpen={ true }>
                    {resourceData.requiredDuringSchedulingIgnoredDuringExecution.map((item, index) => (
                        <PanelListItem key={index}>
                            <PodAffinityTermDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
