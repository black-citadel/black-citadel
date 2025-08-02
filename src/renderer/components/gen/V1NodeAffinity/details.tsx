import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1NodeAffinity, V1PreferredSchedulingTerm, V1NodeSelector } from "@utils/k8s-types";
import { PreferredSchedulingTermDetails } from "../V1PreferredSchedulingTerm/details";
import { NodeSelectorDetails } from "../V1NodeSelector/details";

export const NodeAffinityDetails = ({ resourceData }: { resourceData: V1NodeAffinity }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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
                        <PreferredSchedulingTermDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.requiredDuringSchedulingIgnoredDuringExecution && (
                <Container title="Required During Scheduling Ignored During Execution">
                    <NodeSelectorDetails resourceData={ resourceData.requiredDuringSchedulingIgnoredDuringExecution } />
                </Container>
            )}

        </>
    )
}