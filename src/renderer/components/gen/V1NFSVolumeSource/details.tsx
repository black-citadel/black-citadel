import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1NFSVolumeSource } from "@kubernetes/client-node";

export const NFSVolumeSourceDetails = ({ resourceData }: { resourceData: V1NFSVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.path),
        hasValue(resourceData.server),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Path", value: resourceData.path, description: "path that is exported by the NFS server." },
                    { label: "Server", value: resourceData.server, description: "server is the hostname or IP address of the NFS server." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the NFS export to be mounted with read-only permissions." },
                ]}
            />

        </>
    )
}
