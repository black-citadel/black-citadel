import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1ResourceQuota } from "@kubernetes/client-node";
import { ResourceQuotaSpecDetails } from "../V1ResourceQuotaSpec/details";
import { ResourceQuotaStatusDetails } from "../V1ResourceQuotaStatus/details";

export const ResourceQuotaDetails = ({ resourceData }: { resourceData: V1ResourceQuota }): JSX.Element => {

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
            {resourceData.spec && <ResourceQuotaSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <ResourceQuotaStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}