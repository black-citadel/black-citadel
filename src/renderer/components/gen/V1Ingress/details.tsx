import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Ingress } from "@kubernetes/client-node";
import { IngressSpecDetails } from "../V1IngressSpec/details";
import { IngressStatusDetails } from "../V1IngressStatus/details";

export const IngressDetails = ({ resourceData }: { resourceData: V1Ingress }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <IngressSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <IngressStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
