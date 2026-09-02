import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ReplicaSetStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";

export const ReplicaSetStatusDetails = ({ resourceData }: { resourceData: V1ReplicaSetStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.availableReplicas),
        hasValue(resourceData.fullyLabeledReplicas),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.readyReplicas),
        hasValue(resourceData.replicas),
        hasValue(resourceData.conditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Available Replicas", value: resourceData.availableReplicas, description: "The number of available replicas (ready for at least minReadySeconds) for this replica set." },
                    { label: "Fully Labeled Replicas", value: resourceData.fullyLabeledReplicas, description: "The number of pods that have labels matching the labels of the pod template of the replicaset." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "ObservedGeneration reflects the generation of the most recently observed ReplicaSet." },
                    { label: "Ready Replicas", value: resourceData.readyReplicas, description: "readyReplicas is the number of pods targeted by this ReplicaSet with a Ready Condition." },
                    { label: "Replicas", value: resourceData.replicas, description: "Replicas is the most recently observed number of replicas." },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

        </>
    )
}
