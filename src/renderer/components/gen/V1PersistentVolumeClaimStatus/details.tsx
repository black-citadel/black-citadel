import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PersistentVolumeClaimStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { ModifyVolumeStatusDetails } from "../V1ModifyVolumeStatus/details";

export const PersistentVolumeClaimStatusDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimStatus }): JSX.Element => {
    const allocatedResourceStatusesItems = Object.entries(resourceData.allocatedResourceStatuses ?? {}).map(([key, value]) => ({ label: key, value }));
    const allocatedResourcesItems = Object.entries(resourceData.allocatedResources ?? {}).map(([key, value]) => ({ label: key, value }));
    const capacityItems = Object.entries(resourceData.capacity ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        allocatedResourceStatusesItems.length > 0,
        allocatedResourcesItems.length > 0,
        capacityItems.length > 0,
        hasValue(resourceData.accessModes),
        hasValue(resourceData.currentVolumeAttributesClassName),
        hasValue(resourceData.phase),
        hasValue(resourceData.conditions),
        hasValue(resourceData.modifyVolumeStatus),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Access Modes", value: resourceData.accessModes, description: "accessModes contains the actual access modes the volume backing the PVC has." },
                    { label: "Current Volume Attributes Class Name", value: resourceData.currentVolumeAttributesClassName, description: "currentVolumeAttributesClassName is the current name of the VolumeAttributesClass the PVC is using." },
                    { label: "Phase", value: resourceData.phase, description: "phase represents the current phase of PersistentVolumeClaim." },
                ]}
            />

            <PanelGrid title="Allocated Resource Statuses" items={ allocatedResourceStatusesItems } />

            <PanelGrid title="Allocated Resources" items={ allocatedResourcesItems } />

            <PanelGrid title="Capacity" items={ capacityItems } />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

            {hasValue(resourceData.modifyVolumeStatus) && (
                <Container title="Modify Volume Status" collapsible defaultOpen={ true }>
                    <ModifyVolumeStatusDetails resourceData={resourceData.modifyVolumeStatus } />
                </Container>
            )}

        </>
    )
}
