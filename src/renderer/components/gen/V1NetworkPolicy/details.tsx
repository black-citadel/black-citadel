import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1NetworkPolicy } from "@kubernetes/client-node";
import { NetworkPolicySpecDetails } from "../V1NetworkPolicySpec/details";

export const NetworkPolicyDetails = ({ resourceData }: { resourceData: V1NetworkPolicy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <NetworkPolicySpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
