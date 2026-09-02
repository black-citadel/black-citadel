import { PanelGrid } from "@components/layout/panel";
import type { V1ResourceFieldSelector } from "@kubernetes/client-node";

export const ResourceFieldSelectorDetails = ({ resourceData }: { resourceData: V1ResourceFieldSelector }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.containerName, resourceData.divisor, resourceData.resource].some(v => v !== undefined && v !== null));
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
                    { label: "Container Name", value: resourceData.containerName || '-' },
                    { label: "Divisor", value: resourceData.divisor || '-' },
                    { label: "Resource", value: resourceData.resource }
                ]}
                columns={1}
            />

        </>
    )
}