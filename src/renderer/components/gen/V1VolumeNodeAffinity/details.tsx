import { Container } from "@components/base/container";
import { V1VolumeNodeAffinity } from "@utils/k8s-types";
import { NodeSelectorDetails } from "../V1NodeSelector/details";

export const VolumeNodeAffinityDetails = ({ resourceData }: { resourceData: V1VolumeNodeAffinity }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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