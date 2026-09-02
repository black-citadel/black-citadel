import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1HorizontalPodAutoscalerSpec } from "@kubernetes/client-node";
import { CrossVersionObjectReferenceDetails } from "../V1CrossVersionObjectReference/details";

export const HorizontalPodAutoscalerSpecDetails = ({ resourceData }: { resourceData: V1HorizontalPodAutoscalerSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.maxReplicas),
        hasValue(resourceData.minReplicas),
        hasValue(resourceData.targetCPUUtilizationPercentage),
        hasValue(resourceData.scaleTargetRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Max Replicas", value: resourceData.maxReplicas, description: "maxReplicas is the upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas." },
                    { label: "Min Replicas", value: resourceData.minReplicas, description: "minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down." },
                    { label: "Target CPUUtilization Percentage", value: resourceData.targetCPUUtilizationPercentage, description: "targetCPUUtilizationPercentage is the target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the def…" },
                ]}
            />

            {hasValue(resourceData.scaleTargetRef) && (
                <Container title="Scale Target Ref" collapsible defaultOpen={ true }>
                    <CrossVersionObjectReferenceDetails resourceData={resourceData.scaleTargetRef } />
                </Container>
            )}

        </>
    )
}
