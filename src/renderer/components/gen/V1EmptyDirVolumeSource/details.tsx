import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1EmptyDirVolumeSource } from "@kubernetes/client-node";

export const EmptyDirVolumeSourceDetails = ({ resourceData }: { resourceData: V1EmptyDirVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.medium),
        hasValue(resourceData.sizeLimit),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Medium", value: resourceData.medium, description: "medium represents what type of storage medium should back this directory." },
                    { label: "Size Limit", value: resourceData.sizeLimit, description: "sizeLimit is the total amount of local storage required for this EmptyDir volume." },
                ]}
            />

        </>
    )
}
