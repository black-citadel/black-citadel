import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1CSINode } from "@kubernetes/client-node";
import { CSINodeSpecDetails } from "../V1CSINodeSpec/details";

export const CSINodeDetails = ({ resourceData }: { resourceData: V1CSINode }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <CSINodeSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
