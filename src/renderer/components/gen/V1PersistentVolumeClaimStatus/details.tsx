import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PersistentVolumeClaimStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { ModifyVolumeStatusDetails } from "../V1ModifyVolumeStatus/details";

export const PersistentVolumeClaimStatusDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimStatus }): JSX.Element => {
    // Transform the Allocated Resource Statuses object into an array of PanelGridItem objects
    const allocatedResourceStatusesItems = resourceData.allocatedResourceStatuses
        ? Object.entries(resourceData.allocatedResourceStatuses).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Allocated Resources object into an array of PanelGridItem objects
    const allocatedResourcesItems = resourceData.allocatedResources
        ? Object.entries(resourceData.allocatedResources).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Capacity object into an array of PanelGridItem objects
    const capacityItems = resourceData.capacity
        ? Object.entries(resourceData.capacity).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(allocatedResourceStatusesItems.length > 0 || allocatedResourcesItems.length > 0 || capacityItems.length > 0);
        // Check simple properties
        checks.push([resourceData.currentVolumeAttributesClassName, resourceData.phase].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.modifyVolumeStatus].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Allocated Resource Statuses"
                items={ allocatedResourceStatusesItems }
                columns={1}
            />

            <PanelGrid
                title="Allocated Resources"
                items={ allocatedResourcesItems }
                columns={1}
            />

            <PanelGrid
                title="Capacity"
                items={ capacityItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Current Volume Attributes Class Name", value: resourceData.currentVolumeAttributesClassName || '-' },
                    { label: "Phase", value: resourceData.phase || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

            {resourceData.modifyVolumeStatus && (
                <Container title="Modify Volume Status">
                    <ModifyVolumeStatusDetails resourceData={ resourceData.modifyVolumeStatus } />
                </Container>
            )}

        </>
    )
}