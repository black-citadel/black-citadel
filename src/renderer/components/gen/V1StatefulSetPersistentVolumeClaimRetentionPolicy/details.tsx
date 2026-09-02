import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1StatefulSetPersistentVolumeClaimRetentionPolicy } from "@kubernetes/client-node";

export const StatefulSetPersistentVolumeClaimRetentionPolicyDetails = ({ resourceData }: { resourceData: V1StatefulSetPersistentVolumeClaimRetentionPolicy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.whenDeleted),
        hasValue(resourceData.whenScaled),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "When Deleted", value: resourceData.whenDeleted, description: "WhenDeleted specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is deleted." },
                    { label: "When Scaled", value: resourceData.whenScaled, description: "WhenScaled specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is scaled down." },
                ]}
            />

        </>
    )
}
