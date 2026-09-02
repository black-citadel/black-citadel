import { MetadataDetails } from "@components/metadata";
import type { V1PodTemplateSpec } from "@kubernetes/client-node";
import { PodSpecDetails } from "../V1PodSpec/details";

export const PodTemplateSpecDetails = ({ resourceData }: { resourceData: V1PodTemplateSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.spec].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <PodSpecDetails resourceData={ resourceData.spec } />}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}