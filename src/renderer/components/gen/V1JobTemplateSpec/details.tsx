import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1JobTemplateSpec } from "@kubernetes/client-node";
import { JobSpecDetails } from "../V1JobSpec/details";

export const JobTemplateSpecDetails = ({ resourceData }: { resourceData: V1JobTemplateSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <JobSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
