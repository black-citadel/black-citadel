import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CinderPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const CinderPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1CinderPersistentVolumeSource }): JSX.Element => {

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
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType Filesystem type to mount." },
                    { label: "Volume ID", value: resourceData.volumeID, description: "volumeID used to identify the volume in cinder." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly is Optional: Defaults to false (read/write)." },
                ]}
            />

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
