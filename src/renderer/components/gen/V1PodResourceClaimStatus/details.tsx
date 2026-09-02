import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodResourceClaimStatus } from "@kubernetes/client-node";

export const PodResourceClaimStatusDetails = ({ resourceData }: { resourceData: V1PodResourceClaimStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.resourceClaimName),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name uniquely identifies this resource claim inside the pod." },
                    { label: "Resource Claim Name", value: resourceData.resourceClaimName, description: "ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod." },
                ]}
            />

        </>
    )
}
