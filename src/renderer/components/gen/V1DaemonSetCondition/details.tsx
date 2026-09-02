import { PanelGrid } from "@components/layout/panel";
import type { V1DaemonSetCondition } from "@kubernetes/client-node";

export const DaemonSetConditionDetails = ({ resourceData }: { resourceData: V1DaemonSetCondition }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.message, resourceData.reason, resourceData.status, resourceData.type].some(v => v !== undefined && v !== null));
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
                    { label: "Message", value: resourceData.message || '-' },
                    { label: "Reason", value: resourceData.reason || '-' },
                    { label: "Status", value: resourceData.status },
                    { label: "Type", value: resourceData.type }
                ]}
                columns={1}
            />

        </>
    )
}