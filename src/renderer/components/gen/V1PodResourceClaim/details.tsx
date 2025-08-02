import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PodResourceClaim } from "@utils/k8s-types";

export const PodResourceClaimDetails = ({ resourceData }: { resourceData: V1PodResourceClaim }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.resourceClaimName, resourceData.resourceClaimTemplateName].some(v => v !== undefined && v !== null));
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
                    { label: "Resource Claim Name", value: resourceData.resourceClaimName || '-' },
                    { label: "Resource Claim Template Name", value: resourceData.resourceClaimTemplateName || '-' }
                ]}
                columns={1}
            />

        </>
    )
}