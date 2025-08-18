import { PanelGrid } from "@components/layout/panel";
import { V1StatefulSetStatus } from "@utils/k8s-types";
import { ConditionsTable } from "@components/base/conditions-table";

export const StatefulSetStatusDetails = ({ resourceData }: { resourceData: V1StatefulSetStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.availableReplicas, resourceData.collisionCount, resourceData.currentReplicas, resourceData.currentRevision, resourceData.observedGeneration, resourceData.readyReplicas, resourceData.replicas, resourceData.updateRevision, resourceData.updatedReplicas].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions].some(v => v !== undefined && v !== null));
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
                    { label: "Available Replicas", value: resourceData.availableReplicas || '-' },
                    { label: "Collision Count", value: resourceData.collisionCount || '-' },
                    { label: "Current Replicas", value: resourceData.currentReplicas || '-' },
                    { label: "Current Revision", value: resourceData.currentRevision || '-' },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' },
                    { label: "Ready Replicas", value: resourceData.readyReplicas || '-' },
                    { label: "Replicas", value: resourceData.replicas },
                    { label: "Update Revision", value: resourceData.updateRevision || '-' },
                    { label: "Updated Replicas", value: resourceData.updatedReplicas || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

        </>
    )
}