import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V2HorizontalPodAutoscaler } from "@kubernetes/client-node";
import { HorizontalPodAutoscalerSpecDetails } from "../V2HorizontalPodAutoscalerSpec/details";
import { HorizontalPodAutoscalerStatusDetails } from "../V2HorizontalPodAutoscalerStatus/details";

export const HorizontalPodAutoscalerDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscaler }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <HorizontalPodAutoscalerSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <HorizontalPodAutoscalerStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
