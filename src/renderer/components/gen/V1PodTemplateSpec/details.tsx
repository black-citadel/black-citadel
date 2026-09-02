import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1PodTemplateSpec } from "@kubernetes/client-node";
import { PodSpecDetails } from "../V1PodSpec/details";

export const PodTemplateSpecDetails = ({ resourceData }: { resourceData: V1PodTemplateSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <PodSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
