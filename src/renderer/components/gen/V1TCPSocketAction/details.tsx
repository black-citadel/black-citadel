import { PanelGrid } from "@components/layout/panel";
import type { V1TCPSocketAction } from "@kubernetes/client-node";

export const TCPSocketActionDetails = ({ resourceData }: { resourceData: V1TCPSocketAction }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.host, resourceData.port].some(v => v !== undefined && v !== null));
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
                    { label: "Host", value: resourceData.host || '-' },
                    { label: "Port", value: resourceData.port }
                ]}
                columns={1}
            />

        </>
    )
}