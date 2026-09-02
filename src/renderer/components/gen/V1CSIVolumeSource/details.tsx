import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSIVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const CSIVolumeSourceDetails = ({ resourceData }: { resourceData: V1CSIVolumeSource }): JSX.Element => {
    const volumeAttributesItems = Object.entries(resourceData.volumeAttributes ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        volumeAttributesItems.length > 0,
        hasValue(resourceData.driver),
        hasValue(resourceData.fsType),
        resourceData.readOnly === true,
        hasValue(resourceData.nodePublishSecretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Driver", value: resourceData.driver, description: "driver is the name of the CSI driver that handles this volume." },
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType to mount." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly specifies a read-only configuration for the volume." },
                ]}
            />

            <PanelGrid title="Volume Attributes" items={ volumeAttributesItems } />

            {hasValue(resourceData.nodePublishSecretRef) && (
                <Container title="Node Publish Secret Ref" collapsible defaultOpen={ true }>
                    <LocalObjectReferenceDetails resourceData={resourceData.nodePublishSecretRef } />
                </Container>
            )}

        </>
    )
}
