import { PanelGrid } from "@components/layout/panel";
import type { V1RollingUpdateDaemonSet } from "@kubernetes/client-node";

export const RollingUpdateDaemonSetDetails = ({ resourceData }: { resourceData: V1RollingUpdateDaemonSet }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.maxSurge, resourceData.maxUnavailable].some(v => v !== undefined && v !== null));
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
                    { label: "Max Surge", value: resourceData.maxSurge || '-' },
                    { label: "Max Unavailable", value: resourceData.maxUnavailable || '-' }
                ]}
                columns={1}
            />

        </>
    )
}