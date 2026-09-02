import { PanelGrid } from "@components/layout/panel";
import type { V2MetricValueStatus } from "@kubernetes/client-node";

export const MetricValueStatusDetails = ({ resourceData }: { resourceData: V2MetricValueStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.averageUtilization, resourceData.averageValue, resourceData.value].some(v => v !== undefined && v !== null));
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
                    { label: "Average Utilization", value: resourceData.averageUtilization || '-' },
                    { label: "Average Value", value: resourceData.averageValue || '-' },
                    { label: "Value", value: resourceData.value || '-' }
                ]}
                columns={1}
            />

        </>
    )
}