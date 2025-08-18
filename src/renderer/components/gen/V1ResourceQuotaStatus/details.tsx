import { PanelGrid } from "@components/layout/panel";
import { V1ResourceQuotaStatus } from "@utils/k8s-types";

export const ResourceQuotaStatusDetails = ({ resourceData }: { resourceData: V1ResourceQuotaStatus }): JSX.Element => {
    // Transform the Hard object into an array of PanelGridItem objects
    const hardItems = resourceData.hard
        ? Object.entries(resourceData.hard).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Used object into an array of PanelGridItem objects
    const usedItems = resourceData.used
        ? Object.entries(resourceData.used).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(hardItems.length > 0 || usedItems.length > 0);
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Hard"
                items={ hardItems }
                columns={1}
            />

            <PanelGrid
                title="Used"
                items={ usedItems }
                columns={1}
            />

        </>
    )
}