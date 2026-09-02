import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1IngressClass } from "@kubernetes/client-node";
import { IngressClassSpecDetails } from "../V1IngressClassSpec/details";

export const IngressClassDetails = ({ resourceData }: { resourceData: V1IngressClass }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <IngressClassSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
