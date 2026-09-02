import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ClaimSource } from "@kubernetes/client-node";

export const ClaimSourceDetails = ({ resourceData }: { resourceData: V1ClaimSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.resourceClaimName),
        hasValue(resourceData.resourceClaimTemplateName),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Resource Claim Name", value: resourceData.resourceClaimName, description: "ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod." },
                    { label: "Resource Claim Template Name", value: resourceData.resourceClaimTemplateName, description: "ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod." },
                ]}
            />

        </>
    )
}
