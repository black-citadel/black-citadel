import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1Condition } from "@kubernetes/client-node";

export const ConditionDetails = ({ resourceData }: { resourceData: V1Condition }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.lastTransitionTime),
        hasValue(resourceData.message),
        hasValue(resourceData.observedGeneration),
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
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "lastTransitionTime is the last time the condition transitioned from one status to another." },
                    { label: "Message", value: resourceData.message, description: "message is a human readable message indicating details about the transition." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "observedGeneration represents the .metadata.generation that the condition was set based upon." },
                    { label: "Reason", value: resourceData.reason, description: "reason contains a programmatic identifier indicating the reason for the condition's last transition." },
                    { label: "Status", value: resourceData.status, description: "status of the condition, one of True, False, Unknown." },
                    { label: "Type", value: resourceData.type, description: "type of condition in CamelCase or in foo.example.com/CamelCase." },
                ]}
            />

        </>
    )
}
