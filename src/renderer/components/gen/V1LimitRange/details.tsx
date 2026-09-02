import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1LimitRange } from "@kubernetes/client-node";
import { LimitRangeSpecDetails } from "../V1LimitRangeSpec/details";

export const LimitRangeDetails = ({ resourceData }: { resourceData: V1LimitRange }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <LimitRangeSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
