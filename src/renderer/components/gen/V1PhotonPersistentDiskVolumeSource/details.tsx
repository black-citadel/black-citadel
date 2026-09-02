import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PhotonPersistentDiskVolumeSource } from "@kubernetes/client-node";

export const PhotonPersistentDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1PhotonPersistentDiskVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.pdID),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                    { label: "Pd ID", value: resourceData.pdID, description: "pdID is the ID that identifies Photon Controller persistent disk" },
                ]}
            />

        </>
    )
}
