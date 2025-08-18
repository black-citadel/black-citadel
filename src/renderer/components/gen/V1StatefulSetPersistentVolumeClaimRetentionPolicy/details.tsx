import { PanelGrid } from "@components/layout/panel";
import { V1StatefulSetPersistentVolumeClaimRetentionPolicy } from "@utils/k8s-types";

export const StatefulSetPersistentVolumeClaimRetentionPolicyDetails = ({ resourceData }: { resourceData: V1StatefulSetPersistentVolumeClaimRetentionPolicy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.whenDeleted, resourceData.whenScaled].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "When Deleted", value: resourceData.whenDeleted || '-' },
                    { label: "When Scaled", value: resourceData.whenScaled || '-' }
                ]}
                columns={1}
            />

        </>
    )
}