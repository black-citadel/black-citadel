import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ResourceClaim } from "@kubernetes/client-node";

export const ResourceClaimDetails = ({ resourceData }: { resourceData: V1ResourceClaim }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used." },
                ]}
            />

        </>
    )
}
