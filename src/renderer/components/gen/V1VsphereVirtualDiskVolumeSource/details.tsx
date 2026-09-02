import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1VsphereVirtualDiskVolumeSource } from "@kubernetes/client-node";

export const VsphereVirtualDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1VsphereVirtualDiskVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.storagePolicyID),
        hasValue(resourceData.storagePolicyName),
        hasValue(resourceData.volumePath),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is filesystem type to mount." },
                    { label: "Storage Policy ID", value: resourceData.storagePolicyID, description: "storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName." },
                    { label: "Storage Policy Name", value: resourceData.storagePolicyName, description: "storagePolicyName is the storage Policy Based Management (SPBM) profile name." },
                    { label: "Volume Path", value: resourceData.volumePath, description: "volumePath is the path that identifies vSphere volume vmdk" },
                ]}
            />

        </>
    )
}
