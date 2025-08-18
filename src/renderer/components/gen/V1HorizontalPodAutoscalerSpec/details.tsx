import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1HorizontalPodAutoscalerSpec } from "@utils/k8s-types";
import { CrossVersionObjectReferenceDetails } from "../V1CrossVersionObjectReference/details";

export const HorizontalPodAutoscalerSpecDetails = ({ resourceData }: { resourceData: V1HorizontalPodAutoscalerSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.maxReplicas, resourceData.minReplicas, resourceData.targetCPUUtilizationPercentage].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.scaleTargetRef].some(v => v !== undefined && v !== null));
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
                    { label: "Min Replicas", value: resourceData.minReplicas || '-' },
                    { label: "Target CPUUtilization Percentage", value: resourceData.targetCPUUtilizationPercentage || '-' }
                ]}
                columns={1}
            />

            <Container title="Scale Target Ref">
                <CrossVersionObjectReferenceDetails resourceData={ resourceData.scaleTargetRef } />
            </Container>

        </>
    )
}