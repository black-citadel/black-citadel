import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1HorizontalPodAutoscaler, V1HorizontalPodAutoscalerSpec, V1HorizontalPodAutoscalerStatus } from "@utils/k8s-types";
import { HorizontalPodAutoscalerSpecDetails } from "../V1HorizontalPodAutoscalerSpec/details";
import { HorizontalPodAutoscalerStatusDetails } from "../V1HorizontalPodAutoscalerStatus/details";

export const HorizontalPodAutoscalerDetails = ({ resourceData }: { resourceData: V1HorizontalPodAutoscaler }): JSX.Element => {

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
            {resourceData.spec && <HorizontalPodAutoscalerSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <HorizontalPodAutoscalerStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}