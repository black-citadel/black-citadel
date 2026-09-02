import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1JobCondition } from "@kubernetes/client-node";

export const JobConditionDetails = ({ resourceData }: { resourceData: V1JobCondition }): JSX.Element => {

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
                    { label: "Last Probe Time", value: resourceData.lastProbeTime, description: "Last time the condition was checked." },
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "Last time the condition transit from one status to another." },
                    { label: "Message", value: resourceData.message, description: "Human readable message indicating details about last transition." },
                    { label: "Reason", value: resourceData.reason, description: "(brief) reason for the condition's last transition." },
                    { label: "Status", value: resourceData.status, description: "Status of the condition, one of True, False, Unknown." },
                    { label: "Type", value: resourceData.type, description: "Type of job condition, Complete or Failed." },
                ]}
            />

        </>
    )
}
