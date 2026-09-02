import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1VolumeMountStatus } from "@kubernetes/client-node";

export const VolumeMountStatusDetails = ({ resourceData }: { resourceData: V1VolumeMountStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.mountPath),
        hasValue(resourceData.name),
        hasValue(resourceData.recursiveReadOnly),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Mount Path", value: resourceData.mountPath, description: "MountPath corresponds to the original VolumeMount." },
                    { label: "Name", value: resourceData.name, description: "Name corresponds to the name of the original VolumeMount." },
                    { label: "Recursive Read Only", value: resourceData.recursiveReadOnly, description: "RecursiveReadOnly must be set to Disabled, Enabled, or unspecified (for non-readonly mounts)." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "ReadOnly corresponds to the original VolumeMount." },
                ]}
            />

        </>
    )
}
