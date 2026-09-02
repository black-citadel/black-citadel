import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1FCVolumeSource } from "@kubernetes/client-node";

export const FCVolumeSourceDetails = ({ resourceData }: { resourceData: V1FCVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.lun),
        hasValue(resourceData.targetWWNs),
        hasValue(resourceData.wwids),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                    { label: "Lun", value: resourceData.lun, description: "lun is Optional: FC target lun number" },
                    { label: "Target WWNs", value: resourceData.targetWWNs, description: "targetWWNs is Optional: FC target worldwide names (WWNs)" },
                    { label: "Wwids", value: resourceData.wwids, description: "wwids Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly is Optional: Defaults to false (read/write)." },
                ]}
            />

        </>
    )
}
