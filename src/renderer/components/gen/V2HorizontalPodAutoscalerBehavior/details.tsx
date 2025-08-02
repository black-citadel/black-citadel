import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2HorizontalPodAutoscalerBehavior, V2HPAScalingRules } from "@utils/k8s-types";
import { HPAScalingRulesDetails } from "../V2HPAScalingRules/details";

export const HorizontalPodAutoscalerBehaviorDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerBehavior }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.scaleDown, resourceData.scaleUp].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.scaleDown && (
                <Container title="Scale Down">
                    <HPAScalingRulesDetails resourceData={ resourceData.scaleDown } />
                </Container>
            )}

            {resourceData.scaleUp && (
                <Container title="Scale Up">
                    <HPAScalingRulesDetails resourceData={ resourceData.scaleUp } />
                </Container>
            )}

        </>
    )
}