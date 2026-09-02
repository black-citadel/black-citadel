import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HorizontalPodAutoscalerStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { MetricStatusDetails } from "../V2MetricStatus/details";

export const HorizontalPodAutoscalerStatusDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.currentReplicas),
        hasValue(resourceData.desiredReplicas),
        hasValue(resourceData.lastScaleTime),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.conditions),
        hasValue(resourceData.currentMetrics),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Current Replicas", value: resourceData.currentReplicas, description: "currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler." },
                    { label: "Desired Replicas", value: resourceData.desiredReplicas, description: "desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler." },
                    { label: "Last Scale Time", value: resourceData.lastScaleTime, description: "lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "observedGeneration is the most recent generation observed by this autoscaler." },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

            {hasValue(resourceData.currentMetrics) && (
                <Container title="Current Metrics" count={resourceData.currentMetrics.length} collapsible defaultOpen={ true }>
                    {resourceData.currentMetrics.map((item, index) => (
                        <PanelListItem key={index}>
                            <MetricStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
