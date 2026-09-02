import { PanelGrid } from "@components/layout/panel";
import type { V1IngressPortStatus } from "@kubernetes/client-node";

export const IngressPortStatusDetails = ({ resourceData }: { resourceData: V1IngressPortStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.error, resourceData.port, resourceData.protocol].some(v => v !== undefined && v !== null));
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
                    { label: "Error", value: resourceData.error || '-' },
                    { label: "Port", value: resourceData.port },
                    { label: "Protocol", value: resourceData.protocol }
                ]}
                columns={1}
            />

        </>
    )
}