import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1AzureDiskVolumeSource } from "@kubernetes/client-node";

export const AzureDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1AzureDiskVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.cachingMode),
        hasValue(resourceData.diskName),
        hasValue(resourceData.diskURI),
        hasValue(resourceData.fsType),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Caching Mode", value: resourceData.cachingMode, description: "cachingMode is the Host Caching mode: None, Read Only, Read Write." },
                    { label: "Disk Name", value: resourceData.diskName, description: "diskName is the Name of the data disk in the blob storage" },
                    { label: "Disk URI", value: resourceData.diskURI, description: "diskURI is the URI of data disk in the blob storage" },
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is Filesystem type to mount." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly Defaults to false (read/write)." },
                ]}
            />

        </>
    )
}
