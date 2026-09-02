import { PanelGrid } from "@components/layout/panel";
import type { V1ClaimSource } from "@kubernetes/client-node";

export const ClaimSourceDetails = ({ resourceData }: { resourceData: V1ClaimSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.resourceClaimName, resourceData.resourceClaimTemplateName].some(v => v !== undefined && v !== null));
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
                    { label: "Resource Claim Name", value: resourceData.resourceClaimName || '-' },
                    { label: "Resource Claim Template Name", value: resourceData.resourceClaimTemplateName || '-' }
                ]}
                columns={1}
            />

        </>
    )
}