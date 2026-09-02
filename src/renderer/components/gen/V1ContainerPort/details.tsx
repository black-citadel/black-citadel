import { PanelGrid } from "@components/layout/panel";
import type { V1ContainerPort } from "@kubernetes/client-node";

export const ContainerPortDetails = ({ resourceData }: { resourceData: V1ContainerPort }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.containerPort, resourceData.hostIP, resourceData.hostPort, resourceData.name, resourceData.protocol].some(v => v !== undefined && v !== null));
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
                    { label: "Container Port", value: resourceData.containerPort },
                    { label: "Host IP", value: resourceData.hostIP || '-' },
                    { label: "Host Port", value: resourceData.hostPort || '-' },
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Protocol", value: resourceData.protocol || '-' }
                ]}
                columns={1}
            />

        </>
    )
}