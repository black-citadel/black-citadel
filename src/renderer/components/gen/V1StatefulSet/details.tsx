import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1StatefulSet } from "@kubernetes/client-node";
import { StatefulSetSpecDetails } from "../V1StatefulSetSpec/details";
import { StatefulSetStatusDetails } from "../V1StatefulSetStatus/details";

export const StatefulSetDetails = ({ resourceData }: { resourceData: V1StatefulSet }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <StatefulSetSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <StatefulSetStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}