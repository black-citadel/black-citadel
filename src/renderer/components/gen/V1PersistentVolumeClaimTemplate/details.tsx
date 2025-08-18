import { MetadataDetails } from "@components/metadata";
import { V1PersistentVolumeClaimTemplate } from "@utils/k8s-types";
import { PersistentVolumeClaimSpecDetails } from "../V1PersistentVolumeClaimSpec/details";

export const PersistentVolumeClaimTemplateDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimTemplate }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.spec].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PersistentVolumeClaimSpecDetails resourceData={ resourceData.spec } />

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}