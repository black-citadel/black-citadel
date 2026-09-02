import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2HPAScalingRules } from "@kubernetes/client-node";
import { HPAScalingPolicyDetails } from "../V2HPAScalingPolicy/details";

export const HPAScalingRulesDetails = ({ resourceData }: { resourceData: V2HPAScalingRules }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.selectPolicy),
        hasValue(resourceData.stabilizationWindowSeconds),
        hasValue(resourceData.policies),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Select Policy", value: resourceData.selectPolicy, description: "selectPolicy is used to specify which policy should be used." },
                    { label: "Stabilization Window Seconds", value: resourceData.stabilizationWindowSeconds, description: "stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down." },
                ]}
            />

            {hasValue(resourceData.policies) && (
                <Container title="Policies" count={resourceData.policies.length} collapsible defaultOpen={ true }>
                    {resourceData.policies.map((item, index) => (
                        <PanelListItem key={index}>
                            <HPAScalingPolicyDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
