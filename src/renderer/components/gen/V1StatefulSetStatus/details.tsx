import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1StatefulSetStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";

export const StatefulSetStatusDetails = ({ resourceData }: { resourceData: V1StatefulSetStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.availableReplicas),
        hasValue(resourceData.collisionCount),
        hasValue(resourceData.currentReplicas),
        hasValue(resourceData.currentRevision),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.readyReplicas),
        hasValue(resourceData.replicas),
        hasValue(resourceData.updateRevision),
        hasValue(resourceData.updatedReplicas),
        hasValue(resourceData.conditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Available Replicas", value: resourceData.availableReplicas, description: "Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset." },
                    { label: "Collision Count", value: resourceData.collisionCount, description: "collisionCount is the count of hash collisions for the StatefulSet." },
                    { label: "Current Replicas", value: resourceData.currentReplicas, description: "currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision." },
                    { label: "Current Revision", value: resourceData.currentRevision, description: "currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas)." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "observedGeneration is the most recent generation observed for this StatefulSet." },
                    { label: "Ready Replicas", value: resourceData.readyReplicas, description: "readyReplicas is the number of pods created for this StatefulSet with a Ready Condition." },
                    { label: "Replicas", value: resourceData.replicas, description: "replicas is the number of Pods created by the StatefulSet controller." },
                    { label: "Update Revision", value: resourceData.updateRevision, description: "updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas)" },
                    { label: "Updated Replicas", value: resourceData.updatedReplicas, description: "updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision." },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

        </>
    )
}
