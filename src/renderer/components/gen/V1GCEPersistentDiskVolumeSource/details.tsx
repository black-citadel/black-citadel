import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1GCEPersistentDiskVolumeSource } from "@kubernetes/client-node";

export const GCEPersistentDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1GCEPersistentDiskVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.partition),
        hasValue(resourceData.pdName),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is filesystem type of the volume that you want to mount." },
                    { label: "Partition", value: resourceData.partition, description: "partition is the partition in the volume that you want to mount." },
                    { label: "Pd Name", value: resourceData.pdName, description: "pdName is unique name of the PD resource in GCE." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the ReadOnly setting in VolumeMounts." },
                ]}
            />

        </>
    )
}
