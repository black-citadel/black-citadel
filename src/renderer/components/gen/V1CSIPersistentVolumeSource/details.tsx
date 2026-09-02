import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSIPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const CSIPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1CSIPersistentVolumeSource }): JSX.Element => {
    // Transform the Volume Attributes object into an array of PanelGridItem objects
    const volumeAttributesItems = resourceData.volumeAttributes
        ? Object.entries(resourceData.volumeAttributes).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(volumeAttributesItems.length > 0);
        // Check simple properties
        checks.push([resourceData.driver, resourceData.fsType, resourceData.volumeHandle].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.controllerExpandSecretRef, resourceData.controllerPublishSecretRef, resourceData.nodeExpandSecretRef, resourceData.nodePublishSecretRef, resourceData.nodeStageSecretRef].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Volume Attributes"
                items={ volumeAttributesItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Driver", value: resourceData.driver },
                    { label: "Fs Type", value: resourceData.fsType || '-' },
                    { label: "Volume Handle", value: resourceData.volumeHandle }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.controllerExpandSecretRef && (
                <Container title="Controller Expand Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.controllerExpandSecretRef } />
                </Container>
            )}

            {resourceData.controllerPublishSecretRef && (
                <Container title="Controller Publish Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.controllerPublishSecretRef } />
                </Container>
            )}

            {resourceData.nodeExpandSecretRef && (
                <Container title="Node Expand Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.nodeExpandSecretRef } />
                </Container>
            )}

            {resourceData.nodePublishSecretRef && (
                <Container title="Node Publish Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.nodePublishSecretRef } />
                </Container>
            )}

            {resourceData.nodeStageSecretRef && (
                <Container title="Node Stage Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.nodeStageSecretRef } />
                </Container>
            )}

        </>
    )
}