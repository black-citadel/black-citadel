import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PodFailurePolicyRule } from "@utils/k8s-types";
import { PodFailurePolicyOnExitCodesRequirementDetails } from "../V1PodFailurePolicyOnExitCodesRequirement/details";
import { PodFailurePolicyOnPodConditionsPatternDetails } from "../V1PodFailurePolicyOnPodConditionsPattern/details";

export const PodFailurePolicyRuleDetails = ({ resourceData }: { resourceData: V1PodFailurePolicyRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.action].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.onExitCodes, resourceData.onPodConditions].some(v => v !== undefined && v !== null));
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
                    { label: "Action", value: resourceData.action }
                ]}
                columns={1}
            />

            {resourceData.onExitCodes && (
                <Container title="On Exit Codes">
                    <PodFailurePolicyOnExitCodesRequirementDetails resourceData={ resourceData.onExitCodes } />
                </Container>
            )}

            {resourceData.onPodConditions && (
                <Container title="On Pod Conditions">
                    {resourceData.onPodConditions.map((item, index) => (
                        <PodFailurePolicyOnPodConditionsPatternDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}