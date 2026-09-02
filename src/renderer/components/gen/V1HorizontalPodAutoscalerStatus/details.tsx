import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1HorizontalPodAutoscalerStatus } from "@kubernetes/client-node";

export const HorizontalPodAutoscalerStatusDetails = ({ resourceData }: { resourceData: V1HorizontalPodAutoscalerStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.currentCPUUtilizationPercentage),
        hasValue(resourceData.currentReplicas),
        hasValue(resourceData.desiredReplicas),
        hasValue(resourceData.lastScaleTime),
        hasValue(resourceData.observedGeneration),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Current CPUUtilization Percentage", value: resourceData.currentCPUUtilizationPercentage, description: "currentCPUUtilizationPercentage is the current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g." },
                    { label: "Current Replicas", value: resourceData.currentReplicas, description: "currentReplicas is the current number of replicas of pods managed by this autoscaler." },
                    { label: "Desired Replicas", value: resourceData.desiredReplicas, description: "desiredReplicas is the desired number of replicas of pods managed by this autoscaler." },
                    { label: "Last Scale Time", value: resourceData.lastScaleTime, description: "lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed." },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "observedGeneration is the most recent generation observed by this autoscaler." },
                ]}
            />

        </>
    )
}
