import { PanelGrid } from "@components/layout/panel";
import type { V1VolumeResourceRequirements } from "@kubernetes/client-node";

export const VolumeResourceRequirementsDetails = ({ resourceData }: { resourceData: V1VolumeResourceRequirements }): JSX.Element => {
    // Transform the Limits object into an array of PanelGridItem objects
    const limitsItems = resourceData.limits
        ? Object.entries(resourceData.limits).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Requests object into an array of PanelGridItem objects
    const requestsItems = resourceData.requests
        ? Object.entries(resourceData.requests).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(limitsItems.length > 0 || requestsItems.length > 0);
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Limits"
                items={ limitsItems }
                columns={1}
            />

            <PanelGrid
                title="Requests"
                items={ requestsItems }
                columns={1}
            />

        </>
    )
}