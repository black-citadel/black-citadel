import { PanelGrid } from "@components/layout/panel";
import type { V1PodResourceClaimStatus } from "@kubernetes/client-node";

export const PodResourceClaimStatusDetails = ({ resourceData }: { resourceData: V1PodResourceClaimStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.resourceClaimName].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name },
                    { label: "Resource Claim Name", value: resourceData.resourceClaimName || '-' }
                ]}
                columns={1}
            />

        </>
    )
}