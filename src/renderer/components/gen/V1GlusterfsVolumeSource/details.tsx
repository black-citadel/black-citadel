import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1GlusterfsVolumeSource } from "@kubernetes/client-node";

export const GlusterfsVolumeSourceDetails = ({ resourceData }: { resourceData: V1GlusterfsVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.endpoints),
        hasValue(resourceData.path),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Endpoints", value: resourceData.endpoints, description: "endpoints is the endpoint name that details Glusterfs topology." },
                    { label: "Path", value: resourceData.path, description: "path is the Glusterfs volume path." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the Glusterfs volume to be mounted with read-only permissions." },
                ]}
            />

        </>
    )
}
