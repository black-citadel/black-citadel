import { PanelGrid } from "@components/layout/panel";
import { V1HorizontalPodAutoscalerStatus } from "@utils/k8s-types";

export const HorizontalPodAutoscalerStatusDetails = ({ resourceData }: { resourceData: V1HorizontalPodAutoscalerStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.currentCPUUtilizationPercentage, resourceData.currentReplicas, resourceData.desiredReplicas, resourceData.observedGeneration].some(v => v !== undefined && v !== null));
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
                    { label: "Current CPUUtilization Percentage", value: resourceData.currentCPUUtilizationPercentage || '-' },
                    { label: "Current Replicas", value: resourceData.currentReplicas },
                    { label: "Desired Replicas", value: resourceData.desiredReplicas },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' }
                ]}
                columns={1}
            />

        </>
    )
}