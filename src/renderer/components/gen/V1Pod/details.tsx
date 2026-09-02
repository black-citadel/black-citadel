import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Pod } from "@kubernetes/client-node";
import { PodSpecDetails } from "../V1PodSpec/details";
import { PodStatusDetails } from "../V1PodStatus/details";

export const PodDetails = ({ resourceData }: { resourceData: V1Pod }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <PodSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <PodStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
