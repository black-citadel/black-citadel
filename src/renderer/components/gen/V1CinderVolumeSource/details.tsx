import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CinderVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const CinderVolumeSourceDetails = ({ resourceData }: { resourceData: V1CinderVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.volumeID),
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
                    { label: "Volume ID", value: resourceData.volumeID, description: "volumeID used to identify the volume in cinder." },
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
