import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HorizontalPodAutoscalerSpec } from "@kubernetes/client-node";
import { HorizontalPodAutoscalerBehaviorDetails } from "../V2HorizontalPodAutoscalerBehavior/details";
import { MetricSpecDetails } from "../V2MetricSpec/details";
import { CrossVersionObjectReferenceDetails } from "../V2CrossVersionObjectReference/details";

export const HorizontalPodAutoscalerSpecDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.maxReplicas),
        hasValue(resourceData.minReplicas),
        hasValue(resourceData.behavior),
        hasValue(resourceData.metrics),
        hasValue(resourceData.scaleTargetRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Max Replicas", value: resourceData.maxReplicas, description: "maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up." },
                    { label: "Min Replicas", value: resourceData.minReplicas, description: "minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down." },
                ]}
            />

            {hasValue(resourceData.behavior) && (
                <Container title="Behavior" collapsible defaultOpen={ true }>
                    <HorizontalPodAutoscalerBehaviorDetails resourceData={resourceData.behavior } />
                </Container>
            )}

            {hasValue(resourceData.metrics) && (
                <Container title="Metrics" count={resourceData.metrics.length} collapsible defaultOpen={ true }>
                    {resourceData.metrics.map((item, index) => (
                        <PanelListItem key={index}>
                            <MetricSpecDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.scaleTargetRef) && (
                <Container title="Scale Target Ref" collapsible defaultOpen={ true }>
                    <CrossVersionObjectReferenceDetails resourceData={resourceData.scaleTargetRef } />
                </Container>
            )}

        </>
    )
}
