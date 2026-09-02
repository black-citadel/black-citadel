import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1VolumeNodeAffinity } from "@kubernetes/client-node";
import { NodeSelectorDetails } from "../V1NodeSelector/details";

export const VolumeNodeAffinityDetails = ({ resourceData }: { resourceData: V1VolumeNodeAffinity }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.required),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.required) && (
                <Container title="Required" collapsible defaultOpen={ true }>
                    <NodeSelectorDetails resourceData={resourceData.required } />
                </Container>
            )}

        </>
    )
}
