import { Container } from "@components/base/container";
import type { V1VolumeNodeAffinity } from "@kubernetes/client-node";
import { NodeSelectorDetails } from "../V1NodeSelector/details";

export const VolumeNodeAffinityDetails = ({ resourceData }: { resourceData: V1VolumeNodeAffinity }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.required].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.required && (
                <Container title="Required">
                    <NodeSelectorDetails resourceData={ resourceData.required } />
                </Container>
            )}

        </>
    )
}