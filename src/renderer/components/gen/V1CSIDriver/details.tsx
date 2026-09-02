import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1CSIDriver } from "@kubernetes/client-node";
import { CSIDriverSpecDetails } from "../V1CSIDriverSpec/details";

export const CSIDriverDetails = ({ resourceData }: { resourceData: V1CSIDriver }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <CSIDriverSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
