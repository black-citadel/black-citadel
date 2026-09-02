import { MetadataDetails } from "@components/metadata";
import type { V1IngressClass } from "@kubernetes/client-node";
import { IngressClassSpecDetails } from "../V1IngressClassSpec/details";

export const IngressClassDetails = ({ resourceData }: { resourceData: V1IngressClass }): JSX.Element => {

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
            {resourceData.spec && <IngressClassSpecDetails resourceData={ resourceData.spec } />}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}