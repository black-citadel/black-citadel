import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1DeploymentStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";

export const DeploymentStatusDetails = ({ resourceData }: { resourceData: V1DeploymentStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.replicas),
        hasValue(resourceData.readyReplicas),
        hasValue(resourceData.availableReplicas),
        hasValue(resourceData.unavailableReplicas),
        hasValue(resourceData.updatedReplicas),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.collisionCount),
        hasValue(resourceData.conditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Replicas", value: resourceData.replicas, description: "Total number of non-terminated pods targeted by this deployment (their labels match the selector)." },
                    { label: "Ready Replicas", value: resourceData.readyReplicas, description: "readyReplicas is the number of pods targeted by this Deployment with a Ready Condition." },
                    { label: "Available Replicas", value: resourceData.availableReplicas, description: "Total number of available pods (ready for at least minReadySeconds) targeted by this deployment." },
                    { label: "Unavailable Replicas", value: resourceData.unavailableReplicas, description: "Total number of unavailable pods targeted by this deployment." },
                    { label: "Updated Replicas", value: resourceData.updatedReplicas, description: "Total number of non-terminated pods targeted by this deployment that have the desired template spec." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "The generation observed by the deployment controller." },
                    { label: "Collision Count", value: resourceData.collisionCount, description: "Count of hash collisions for the Deployment." },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

        </>
    )
}
