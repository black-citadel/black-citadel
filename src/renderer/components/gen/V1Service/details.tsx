import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Service } from "@kubernetes/client-node";
import { ServiceSpecDetails } from "../V1ServiceSpec/details";
import { ServiceStatusDetails } from "../V1ServiceStatus/details";

export const ServiceDetails = ({ resourceData }: { resourceData: V1Service }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <ServiceSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <ServiceStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
