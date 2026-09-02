import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1DaemonSetStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";

export const DaemonSetStatusDetails = ({ resourceData }: { resourceData: V1DaemonSetStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.collisionCount),
        hasValue(resourceData.currentNumberScheduled),
        hasValue(resourceData.desiredNumberScheduled),
        hasValue(resourceData.numberAvailable),
        hasValue(resourceData.numberMisscheduled),
        hasValue(resourceData.numberReady),
        hasValue(resourceData.numberUnavailable),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.updatedNumberScheduled),
        hasValue(resourceData.conditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Collision Count", value: resourceData.collisionCount, description: "Count of hash collisions for the DaemonSet." },
                    { label: "Current Number Scheduled", value: resourceData.currentNumberScheduled, description: "The number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod." },
                    { label: "Desired Number Scheduled", value: resourceData.desiredNumberScheduled, description: "The total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod)." },
                    { label: "Number Available", value: resourceData.numberAvailable, description: "The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available (ready for at least spec.minReadySeconds)" },
                    { label: "Number Misscheduled", value: resourceData.numberMisscheduled, description: "The number of nodes that are running the daemon pod, but are not supposed to run the daemon pod." },
                    { label: "Number Ready", value: resourceData.numberReady, description: "numberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running with a Ready Condition." },
                    { label: "Number Unavailable", value: resourceData.numberUnavailable, description: "The number of nodes that should be running the daemon pod and have none of the daemon pod running and available (ready for at least spec.minReadySeconds)" },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "The most recent generation observed by the daemon set controller." },
                    { label: "Updated Number Scheduled", value: resourceData.updatedNumberScheduled, description: "The total number of nodes that are running updated daemon pod" },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

        </>
    )
}
