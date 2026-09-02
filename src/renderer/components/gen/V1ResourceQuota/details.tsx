import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1ResourceQuota } from "@kubernetes/client-node";
import { ResourceQuotaSpecDetails } from "../V1ResourceQuotaSpec/details";
import { ResourceQuotaStatusDetails } from "../V1ResourceQuotaStatus/details";

export const ResourceQuotaDetails = ({ resourceData }: { resourceData: V1ResourceQuota }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
        hasValue(resourceData.status),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <ResourceQuotaSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <ResourceQuotaStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
