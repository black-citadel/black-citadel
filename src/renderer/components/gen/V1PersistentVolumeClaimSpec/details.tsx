import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PersistentVolumeClaimSpec } from "@utils/k8s-types";
import { TypedLocalObjectReferenceDetails } from "../V1TypedLocalObjectReference/details";
import { TypedObjectReferenceDetails } from "../V1TypedObjectReference/details";
import { VolumeResourceRequirementsDetails } from "../V1VolumeResourceRequirements/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PersistentVolumeClaimSpecDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.storageClassName, resourceData.volumeAttributesClassName, resourceData.volumeMode, resourceData.volumeName].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.dataSource, resourceData.dataSourceRef, resourceData.resources, resourceData.selector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Storage Class Name", value: resourceData.storageClassName || '-' },
                    { label: "Volume Attributes Class Name", value: resourceData.volumeAttributesClassName || '-' },
                    { label: "Volume Mode", value: resourceData.volumeMode || '-' },
                    { label: "Volume Name", value: resourceData.volumeName || '-' }
                ]}
                columns={1}
            />

            {resourceData.dataSource && (
                <Container title="Data Source">
                    <TypedLocalObjectReferenceDetails resourceData={ resourceData.dataSource } />
                </Container>
            )}

            {resourceData.dataSourceRef && (
                <Container title="Data Source Ref">
                    <TypedObjectReferenceDetails resourceData={ resourceData.dataSourceRef } />
                </Container>
            )}

            {resourceData.resources && (
                <Container title="Resources">
                    <VolumeResourceRequirementsDetails resourceData={ resourceData.resources } />
                </Container>
            )}

            {resourceData.selector && (
                <Container title="Selector">
                    <LabelSelectorDetails resourceData={ resourceData.selector } />
                </Container>
            )}

        </>
    )
}