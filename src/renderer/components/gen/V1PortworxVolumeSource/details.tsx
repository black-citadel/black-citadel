import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PortworxVolumeSource } from "@kubernetes/client-node";

export const PortworxVolumeSourceDetails = ({ resourceData }: { resourceData: V1PortworxVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.volumeID),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system." },
                    { label: "Volume ID", value: resourceData.volumeID, description: "volumeID uniquely identifies a Portworx volume" },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly defaults to false (read/write)." },
                ]}
            />

        </>
    )
}
