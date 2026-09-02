import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PersistentVolumeClaimSpec } from "@kubernetes/client-node";
import { TypedLocalObjectReferenceDetails } from "../V1TypedLocalObjectReference/details";
import { TypedObjectReferenceDetails } from "../V1TypedObjectReference/details";
import { VolumeResourceRequirementsDetails } from "../V1VolumeResourceRequirements/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PersistentVolumeClaimSpecDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.accessModes),
        hasValue(resourceData.storageClassName),
        hasValue(resourceData.volumeAttributesClassName),
        hasValue(resourceData.volumeMode),
        hasValue(resourceData.volumeName),
        hasValue(resourceData.dataSource),
        hasValue(resourceData.dataSourceRef),
        hasValue(resourceData.resources),
        hasValue(resourceData.selector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Access Modes", value: resourceData.accessModes, description: "accessModes contains the desired access modes the volume should have." },
                    { label: "Storage Class Name", value: resourceData.storageClassName, description: "storageClassName is the name of the StorageClass required by the claim." },
                    { label: "Volume Attributes Class Name", value: resourceData.volumeAttributesClassName, description: "volumeAttributesClassName may be used to set the VolumeAttributesClass used by this claim." },
                    { label: "Volume Mode", value: resourceData.volumeMode, description: "volumeMode defines what type of volume is required by the claim." },
                    { label: "Volume Name", value: resourceData.volumeName, description: "volumeName is the binding reference to the PersistentVolume backing this claim." },
                ]}
            />

            {hasValue(resourceData.dataSource) && (
                <Container title="Data Source" collapsible defaultOpen={ true }>
                    <TypedLocalObjectReferenceDetails resourceData={resourceData.dataSource } />
                </Container>
            )}

            {hasValue(resourceData.dataSourceRef) && (
                <Container title="Data Source Ref" collapsible defaultOpen={ true }>
                    <TypedObjectReferenceDetails resourceData={resourceData.dataSourceRef } />
                </Container>
            )}

            {hasValue(resourceData.resources) && (
                <Container title="Resources" collapsible defaultOpen={ true }>
                    <VolumeResourceRequirementsDetails resourceData={resourceData.resources } />
                </Container>
            )}

            {hasValue(resourceData.selector) && (
                <Container title="Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.selector } />
                </Container>
            )}

        </>
    )
}
