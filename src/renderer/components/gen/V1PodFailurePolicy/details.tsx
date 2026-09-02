import { Container } from "@components/base/container";
import type { V1PodFailurePolicy } from "@kubernetes/client-node";
import { PodFailurePolicyRuleDetails } from "../V1PodFailurePolicyRule/details";

export const PodFailurePolicyDetails = ({ resourceData }: { resourceData: V1PodFailurePolicy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.rules].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.rules && (
                <Container title="Rules">
                    {resourceData.rules.map((item, index) => (
                        <PodFailurePolicyRuleDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}