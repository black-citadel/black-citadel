import { PanelGrid } from "@components/layout/panel";
import { V1ContainerStateTerminated } from "@utils/k8s-types";

export const ContainerStateTerminatedDetails = ({ resourceData }: { resourceData: V1ContainerStateTerminated }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.containerID, resourceData.exitCode, resourceData.message, resourceData.reason, resourceData.signal].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Container ID", value: resourceData.containerID || '-' },
                    { label: "Exit Code", value: resourceData.exitCode },
                    { label: "Message", value: resourceData.message || '-' },
                    { label: "Reason", value: resourceData.reason || '-' },
                    { label: "Signal", value: resourceData.signal || '-' }
                ]}
                columns={1}
            />

        </>
    )
}