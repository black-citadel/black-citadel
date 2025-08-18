import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Ingress } from "@utils/k8s-types";
import { IngressSpecDetails } from "../V1IngressSpec/details";
import { IngressStatusDetails } from "../V1IngressStatus/details";

export const IngressDetails = ({ resourceData }: { resourceData: V1Ingress }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <IngressSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <IngressStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}