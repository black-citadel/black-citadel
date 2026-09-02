import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HorizontalPodAutoscalerSpec } from "@kubernetes/client-node";
import { HorizontalPodAutoscalerBehaviorDetails } from "../V2HorizontalPodAutoscalerBehavior/details";
import { MetricSpecDetails } from "../V2MetricSpec/details";
import { CrossVersionObjectReferenceDetails } from "../V2CrossVersionObjectReference/details";

export const HorizontalPodAutoscalerSpecDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.maxReplicas, resourceData.minReplicas].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.behavior, resourceData.metrics, resourceData.scaleTargetRef].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Max Replicas", value: resourceData.maxReplicas },
                    { label: "Min Replicas", value: resourceData.minReplicas || '-' }
                ]}
                columns={1}
            />

            {resourceData.behavior && (
                <Container title="Behavior">
                    <HorizontalPodAutoscalerBehaviorDetails resourceData={ resourceData.behavior } />
                </Container>
            )}

            {resourceData.metrics && (
                <Container title="Metrics">
                    {resourceData.metrics.map((item, index) => (
                        <MetricSpecDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            <Container title="Scale Target Ref">
                <CrossVersionObjectReferenceDetails resourceData={ resourceData.scaleTargetRef } />
            </Container>

        </>
    )
}