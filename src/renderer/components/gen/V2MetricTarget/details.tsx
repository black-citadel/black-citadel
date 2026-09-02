import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V2MetricTarget } from "@kubernetes/client-node";

export const MetricTargetDetails = ({ resourceData }: { resourceData: V2MetricTarget }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.averageUtilization),
        hasValue(resourceData.averageValue),
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
                    { label: "Average Utilization", value: resourceData.averageUtilization, description: "averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of th…" },
                    { label: "Average Value", value: resourceData.averageValue, description: "averageValue is the target value of the average of the metric across all relevant pods (as a quantity)" },
                    { label: "Type", value: resourceData.type, description: "type represents whether the metric type is Utilization, Value, or AverageValue" },
                    { label: "Value", value: resourceData.value, description: "value is the target value of the metric (as a quantity)." },
                ]}
            />

        </>
    )
}
