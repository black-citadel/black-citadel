import { PanelGrid } from "@components/layout/panel";
import { V2HPAScalingPolicy } from "@utils/k8s-types";

export const HPAScalingPolicyDetails = ({ resourceData }: { resourceData: V2HPAScalingPolicy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.periodSeconds, resourceData.type, resourceData.value].some(v => v !== undefined && v !== null));
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
                    { label: "Period Seconds", value: resourceData.periodSeconds },
                    { label: "Type", value: resourceData.type },
                    { label: "Value", value: resourceData.value }
                ]}
                columns={1}
            />

        </>
    )
}