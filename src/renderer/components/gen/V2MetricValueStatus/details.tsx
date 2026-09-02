import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V2MetricValueStatus } from "@kubernetes/client-node";

export const MetricValueStatusDetails = ({ resourceData }: { resourceData: V2MetricValueStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.averageUtilization),
        hasValue(resourceData.averageValue),
        hasValue(resourceData.value),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Average Utilization", value: resourceData.averageUtilization, description: "currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested val…" },
                    { label: "Average Value", value: resourceData.averageValue, description: "averageValue is the current value of the average of the metric across all relevant pods (as a quantity)" },
                    { label: "Value", value: resourceData.value, description: "value is the current value of the metric (as a quantity)." },
                ]}
            />

        </>
    )
}
