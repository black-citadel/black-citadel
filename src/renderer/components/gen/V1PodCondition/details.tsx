import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodCondition } from "@kubernetes/client-node";

export const PodConditionDetails = ({ resourceData }: { resourceData: V1PodCondition }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.lastProbeTime),
        hasValue(resourceData.lastTransitionTime),
        hasValue(resourceData.message),
        hasValue(resourceData.reason),
        hasValue(resourceData.status),
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Last Probe Time", value: resourceData.lastProbeTime, description: "Last time we probed the condition." },
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "Last time the condition transitioned from one status to another." },
                    { label: "Message", value: resourceData.message, description: "Human-readable message indicating details about last transition." },
                    { label: "Reason", value: resourceData.reason, description: "Unique, one-word, CamelCase reason for the condition's last transition." },
                    { label: "Status", value: resourceData.status, description: "Status is the status of the condition." },
                    { label: "Type", value: resourceData.type, description: "Type is the type of the condition." },
                ]}
            />

        </>
    )
}
