import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V2HPAScalingPolicy } from "@kubernetes/client-node";

export const HPAScalingPolicyDetails = ({ resourceData }: { resourceData: V2HPAScalingPolicy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.periodSeconds),
        hasValue(resourceData.type),
        hasValue(resourceData.value),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Period Seconds", value: resourceData.periodSeconds, description: "periodSeconds specifies the window of time for which the policy should hold true." },
                    { label: "Type", value: resourceData.type, description: "type is used to specify the scaling policy." },
                    { label: "Value", value: resourceData.value, description: "value contains the amount of change which is permitted by the policy." },
                ]}
            />

        </>
    )
}
