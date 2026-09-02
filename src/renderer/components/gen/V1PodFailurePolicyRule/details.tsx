import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodFailurePolicyRule } from "@kubernetes/client-node";
import { PodFailurePolicyOnExitCodesRequirementDetails } from "../V1PodFailurePolicyOnExitCodesRequirement/details";
import { PodFailurePolicyOnPodConditionsPatternDetails } from "../V1PodFailurePolicyOnPodConditionsPattern/details";

export const PodFailurePolicyRuleDetails = ({ resourceData }: { resourceData: V1PodFailurePolicyRule }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.action),
        hasValue(resourceData.onExitCodes),
        hasValue(resourceData.onPodConditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Action", value: resourceData.action, description: "Specifies the action taken on a pod failure when the requirements are satisfied." },
                ]}
            />

            {hasValue(resourceData.onExitCodes) && (
                <Container title="On Exit Codes" collapsible defaultOpen={ true }>
                    <PodFailurePolicyOnExitCodesRequirementDetails resourceData={resourceData.onExitCodes } />
                </Container>
            )}

            {hasValue(resourceData.onPodConditions) && (
                <Container title="On Pod Conditions" count={resourceData.onPodConditions.length} collapsible defaultOpen={ true }>
                    {resourceData.onPodConditions.map((item, index) => (
                        <PanelListItem key={index}>
                            <PodFailurePolicyOnPodConditionsPatternDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
