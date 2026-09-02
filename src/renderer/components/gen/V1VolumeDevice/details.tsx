import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1VolumeDevice } from "@kubernetes/client-node";

export const VolumeDeviceDetails = ({ resourceData }: { resourceData: V1VolumeDevice }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.devicePath),
        hasValue(resourceData.name),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Device Path", value: resourceData.devicePath, description: "devicePath is the path inside of the container that the device will be mapped to." },
                    { label: "Name", value: resourceData.name, description: "name must match the name of a persistentVolumeClaim in the pod" },
                ]}
            />

        </>
    )
}
