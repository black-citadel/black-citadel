import { PanelGrid } from "@components/layout/panel";
import type { V1EmptyDirVolumeSource } from "@kubernetes/client-node";

export const EmptyDirVolumeSourceDetails = ({ resourceData }: { resourceData: V1EmptyDirVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.medium, resourceData.sizeLimit].some(v => v !== undefined && v !== null));
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
                    { label: "Medium", value: resourceData.medium || '-' },
                    { label: "Size Limit", value: resourceData.sizeLimit || '-' }
                ]}
                columns={1}
            />

        </>
    )
}