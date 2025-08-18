import { Container } from "@components/base/container";
import { V1SuccessPolicy } from "@utils/k8s-types";
import { SuccessPolicyRuleDetails } from "../V1SuccessPolicyRule/details";

export const SuccessPolicyDetails = ({ resourceData }: { resourceData: V1SuccessPolicy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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
                        <SuccessPolicyRuleDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}