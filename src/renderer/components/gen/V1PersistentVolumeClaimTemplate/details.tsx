import { hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1PersistentVolumeClaimTemplate } from "@kubernetes/client-node";
import { PersistentVolumeClaimSpecDetails } from "../V1PersistentVolumeClaimSpec/details";

export const PersistentVolumeClaimTemplateDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimTemplate }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <PersistentVolumeClaimSpecDetails resourceData={resourceData.spec } />}

        </>
    )
}
