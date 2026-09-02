import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PersistentVolumeClaimCondition } from "@kubernetes/client-node";

export const PersistentVolumeClaimConditionDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimCondition }): JSX.Element => {

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
                    { label: "Last Probe Time", value: resourceData.lastProbeTime, description: "lastProbeTime is the time we probed the condition." },
                    { label: "Last Transition Time", value: resourceData.lastTransitionTime, description: "lastTransitionTime is the time the condition transitioned from one status to another." },
                    { label: "Message", value: resourceData.message, description: "message is the human-readable message indicating details about last transition." },
                    { label: "Reason", value: resourceData.reason, description: "reason is a unique, this should be a short, machine understandable string that gives the reason for condition's last transition." },
                    { label: "Status", value: resourceData.status },
                    { label: "Type", value: resourceData.type },
                ]}
            />

        </>
    )
}
