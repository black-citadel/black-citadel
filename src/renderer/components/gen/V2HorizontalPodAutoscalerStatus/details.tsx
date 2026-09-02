import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HorizontalPodAutoscalerStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { MetricStatusDetails } from "../V2MetricStatus/details";

export const HorizontalPodAutoscalerStatusDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.currentReplicas, resourceData.desiredReplicas, resourceData.observedGeneration].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.currentMetrics].some(v => v !== undefined && v !== null));
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
                    { label: "Current Replicas", value: resourceData.currentReplicas || '-' },
                    { label: "Desired Replicas", value: resourceData.desiredReplicas },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

            {resourceData.currentMetrics && (
                <Container title="Current Metrics">
                    {resourceData.currentMetrics.map((item, index) => (
                        <MetricStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}