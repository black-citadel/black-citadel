import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1StorageOSVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const StorageOSVolumeSourceDetails = ({ resourceData }: { resourceData: V1StorageOSVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.volumeName),
        hasValue(resourceData.volumeNamespace),
        resourceData.readOnly === true,
        hasValue(resourceData.secretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                    { label: "Volume Name", value: resourceData.volumeName, description: "volumeName is the human-readable name of the StorageOS volume." },
                    { label: "Volume Namespace", value: resourceData.volumeNamespace, description: "volumeNamespace specifies the scope of the volume within StorageOS." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly defaults to false (read/write)." },
                ]}
            />

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <LocalObjectReferenceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
