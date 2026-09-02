import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1StatefulSetCondition } from "@kubernetes/client-node";

export const StatefulSetConditionDetails = ({ resourceData }: { resourceData: V1StatefulSetCondition }): JSX.Element => {

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
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "Last time the condition transitioned from one status to another." },
                    { label: "Message", value: resourceData.message, description: "A human readable message indicating details about the transition." },
                    { label: "Reason", value: resourceData.reason, description: "The reason for the condition's last transition." },
                    { label: "Status", value: resourceData.status, description: "Status of the condition, one of True, False, Unknown." },
                    { label: "Type", value: resourceData.type, description: "Type of statefulset condition." },
                ]}
            />

        </>
    )
}
