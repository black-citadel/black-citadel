import { PanelGrid } from "@components/layout/panel";
import { V1ResourceHealth } from "@utils/k8s-types";

export const ResourceHealthDetails = ({ resourceData }: { resourceData: V1ResourceHealth }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.health, resourceData.resourceID].some(v => v !== undefined && v !== null));
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
                    { label: "Health", value: resourceData.health || '-' },
                    { label: "Resource ID", value: resourceData.resourceID }
                ]}
                columns={1}
            />

        </>
    )
}