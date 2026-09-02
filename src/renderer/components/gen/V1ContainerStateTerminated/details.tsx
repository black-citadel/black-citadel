import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ContainerStateTerminated } from "@kubernetes/client-node";

export const ContainerStateTerminatedDetails = ({ resourceData }: { resourceData: V1ContainerStateTerminated }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.containerID),
        hasValue(resourceData.exitCode),
        hasValue(resourceData.finishedAt),
        hasValue(resourceData.message),
        hasValue(resourceData.reason),
        hasValue(resourceData.signal),
        hasValue(resourceData.startedAt),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Container ID", value: resourceData.containerID, description: "Container's ID in the format '<type>://<container_id>'" },
                    { label: "Exit Code", value: resourceData.exitCode, description: "Exit status from the last termination of the container" },
                    { label: "Finished At", value: resourceData.finishedAt, description: "Time at which the container last terminated" },
                    { label: "Message", value: resourceData.message, description: "Message regarding the last termination of the container" },
                    { label: "Reason", value: resourceData.reason, description: "(brief) reason from the last termination of the container" },
                    { label: "Signal", value: resourceData.signal, description: "Signal from the last termination of the container" },
                    { label: "Started At", value: resourceData.startedAt, description: "Time at which previous execution of the container started" },
                ]}
            />

        </>
    )
}
