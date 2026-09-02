import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V2HorizontalPodAutoscalerCondition } from "@kubernetes/client-node";

export const HorizontalPodAutoscalerConditionDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerCondition }): JSX.Element => {

    const hasContent = [
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
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "lastTransitionTime is the last time the condition transitioned from one status to another" },
                    { label: "Message", value: resourceData.message, description: "message is a human-readable explanation containing details about the transition" },
                    { label: "Reason", value: resourceData.reason, description: "reason is the reason for the condition's last transition." },
                    { label: "Status", value: resourceData.status, description: "status is the status of the condition (True, False, Unknown)" },
                    { label: "Type", value: resourceData.type, description: "type describes the current condition" },
                ]}
            />

        </>
    )
}
