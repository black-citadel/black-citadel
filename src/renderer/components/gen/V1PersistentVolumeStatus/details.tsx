import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PersistentVolumeStatus } from "@kubernetes/client-node";

export const PersistentVolumeStatusDetails = ({ resourceData }: { resourceData: V1PersistentVolumeStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.lastPhaseTransitionTime),
        hasValue(resourceData.message),
        hasValue(resourceData.phase),
        hasValue(resourceData.reason),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Last Phase Transition Time", value: resourceData.lastPhaseTransitionTime, description: "lastPhaseTransitionTime is the time the phase transitioned from one to another and automatically resets to current time everytime a volume phase transitions." },
                    { label: "Message", value: resourceData.message, description: "message is a human-readable message indicating details about why the volume is in this state." },
                    { label: "Phase", value: resourceData.phase, description: "phase indicates if a volume is available, bound to a claim, or released by a claim." },
                    { label: "Reason", value: resourceData.reason, description: "reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI." },
                ]}
            />

        </>
    )
}
