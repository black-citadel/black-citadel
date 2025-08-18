import { MetadataDetails } from "@components/metadata";
import { V1CSIDriver } from "@utils/k8s-types";
import { CSIDriverSpecDetails } from "../V1CSIDriverSpec/details";

export const CSIDriverDetails = ({ resourceData }: { resourceData: V1CSIDriver }): JSX.Element => {

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
            <CSIDriverSpecDetails resourceData={ resourceData.spec } />

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}