import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1VolumeNodeResources } from "@kubernetes/client-node";

export const VolumeNodeResourcesDetails = ({ resourceData }: { resourceData: V1VolumeNodeResources }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.count),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Count", value: resourceData.count, description: "count indicates the maximum number of unique volumes managed by the CSI driver that can be used on a node." },
                ]}
            />

        </>
    )
}
