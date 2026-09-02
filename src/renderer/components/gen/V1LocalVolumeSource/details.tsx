import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1LocalVolumeSource } from "@kubernetes/client-node";

export const LocalVolumeSourceDetails = ({ resourceData }: { resourceData: V1LocalVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.path),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                    { label: "Path", value: resourceData.path, description: "path of the full path to the volume on the node." },
                ]}
            />

        </>
    )
}
