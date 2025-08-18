import { PanelGrid } from "@components/layout/panel";
import { V1RollingUpdateDaemonSet } from "@utils/k8s-types";

export const RollingUpdateDaemonSetDetails = ({ resourceData }: { resourceData: V1RollingUpdateDaemonSet }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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