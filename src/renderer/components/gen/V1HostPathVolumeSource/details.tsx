import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1HostPathVolumeSource } from "@kubernetes/client-node";

export const HostPathVolumeSourceDetails = ({ resourceData }: { resourceData: V1HostPathVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.path),
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Path", value: resourceData.path, description: "path of the directory on the host." },
                    { label: "Type", value: resourceData.type, description: "type for HostPath Volume Defaults to \"\" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath" },
                ]}
            />

        </>
    )
}
