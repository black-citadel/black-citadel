import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V2HPAScalingRules } from "@utils/k8s-types";
import { HPAScalingPolicyDetails } from "../V2HPAScalingPolicy/details";

export const HPAScalingRulesDetails = ({ resourceData }: { resourceData: V2HPAScalingRules }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.selectPolicy, resourceData.stabilizationWindowSeconds].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.policies].some(v => v !== undefined && v !== null));
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
                    { label: "Select Policy", value: resourceData.selectPolicy || '-' },
                    { label: "Stabilization Window Seconds", value: resourceData.stabilizationWindowSeconds || '-' }
                ]}
                columns={1}
            />

            {resourceData.policies && (
                <Container title="Policies">
                    {resourceData.policies.map((item, index) => (
                        <HPAScalingPolicyDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}