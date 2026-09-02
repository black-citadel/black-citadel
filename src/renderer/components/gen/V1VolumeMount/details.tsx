import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1VolumeMount } from "@kubernetes/client-node";

export const VolumeMountDetails = ({ resourceData }: { resourceData: V1VolumeMount }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.mountPath),
        hasValue(resourceData.subPath),
        hasValue(resourceData.subPathExpr),
        hasValue(resourceData.mountPropagation),
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
                    { label: "Name", value: resourceData.name, description: "This must match the Name of a Volume." },
                    { label: "Mount Path", value: resourceData.mountPath, description: "Path within the container at which the volume should be mounted." },
                    { label: "Sub Path", value: resourceData.subPath, description: "Path within the volume from which the container's volume should be mounted." },
                    { label: "Sub Path Expr", value: resourceData.subPathExpr, description: "Expanded path within the volume from which the container's volume should be mounted." },
                    { label: "Mount Propagation", value: resourceData.mountPropagation, description: "mountPropagation determines how mounts are propagated from the host to container and the other way around." },
                    { label: "Recursive Read Only", value: resourceData.recursiveReadOnly, description: "RecursiveReadOnly specifies whether read-only mounts should be handled recursively." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "Mounted read-only if true, read-write otherwise (false or unspecified)." },
                ]}
            />

        </>
    )
}
