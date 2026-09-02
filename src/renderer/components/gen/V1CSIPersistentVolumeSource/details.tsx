import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSIPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const CSIPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1CSIPersistentVolumeSource }): JSX.Element => {
    const volumeAttributesItems = Object.entries(resourceData.volumeAttributes ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        volumeAttributesItems.length > 0,
        hasValue(resourceData.driver),
        hasValue(resourceData.fsType),
        hasValue(resourceData.volumeHandle),
        resourceData.readOnly === true,
        hasValue(resourceData.controllerExpandSecretRef),
        hasValue(resourceData.controllerPublishSecretRef),
        hasValue(resourceData.nodeExpandSecretRef),
        hasValue(resourceData.nodePublishSecretRef),
        hasValue(resourceData.nodeStageSecretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Driver", value: resourceData.driver, description: "driver is the name of the driver to use for this volume." },
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType to mount." },
                    { label: "Volume Handle", value: resourceData.volumeHandle, description: "volumeHandle is the unique volume name returned by the CSI volume plugin’s CreateVolume to refer to the volume on all subsequent calls." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly value to pass to ControllerPublishVolumeRequest." },
                ]}
            />

            <PanelGrid title="Volume Attributes" items={ volumeAttributesItems } />

            {hasValue(resourceData.controllerExpandSecretRef) && (
                <Container title="Controller Expand Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.controllerExpandSecretRef } />
                </Container>
            )}

            {hasValue(resourceData.controllerPublishSecretRef) && (
                <Container title="Controller Publish Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.controllerPublishSecretRef } />
                </Container>
            )}

            {hasValue(resourceData.nodeExpandSecretRef) && (
                <Container title="Node Expand Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.nodeExpandSecretRef } />
                </Container>
            )}

            {hasValue(resourceData.nodePublishSecretRef) && (
                <Container title="Node Publish Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.nodePublishSecretRef } />
                </Container>
            )}

            {hasValue(resourceData.nodeStageSecretRef) && (
                <Container title="Node Stage Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.nodeStageSecretRef } />
                </Container>
            )}

        </>
    )
}
