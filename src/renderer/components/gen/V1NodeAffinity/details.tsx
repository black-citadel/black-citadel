import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NodeAffinity } from "@kubernetes/client-node";
import { PreferredSchedulingTermDetails } from "../V1PreferredSchedulingTerm/details";
import { NodeSelectorDetails } from "../V1NodeSelector/details";

export const NodeAffinityDetails = ({ resourceData }: { resourceData: V1NodeAffinity }): JSX.Element => {

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
                            <PreferredSchedulingTermDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.requiredDuringSchedulingIgnoredDuringExecution) && (
                <Container title="Required During Scheduling Ignored During Execution" collapsible defaultOpen={ true }>
                    <NodeSelectorDetails resourceData={resourceData.requiredDuringSchedulingIgnoredDuringExecution } />
                </Container>
            )}

        </>
    )
}
