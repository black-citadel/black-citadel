import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HorizontalPodAutoscalerBehavior } from "@kubernetes/client-node";
import { HPAScalingRulesDetails } from "../V2HPAScalingRules/details";

export const HorizontalPodAutoscalerBehaviorDetails = ({ resourceData }: { resourceData: V2HorizontalPodAutoscalerBehavior }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.scaleDown),
        hasValue(resourceData.scaleUp),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.scaleDown) && (
                <Container title="Scale Down" collapsible defaultOpen={ true }>
                    <HPAScalingRulesDetails resourceData={resourceData.scaleDown } />
                </Container>
            )}

            {hasValue(resourceData.scaleUp) && (
                <Container title="Scale Up" collapsible defaultOpen={ true }>
                    <HPAScalingRulesDetails resourceData={resourceData.scaleUp } />
                </Container>
            )}

        </>
    )
}
