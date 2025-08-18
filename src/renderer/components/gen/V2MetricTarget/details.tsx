import { PanelGrid } from "@components/layout/panel";
import { V2MetricTarget } from "@utils/k8s-types";

export const MetricTargetDetails = ({ resourceData }: { resourceData: V2MetricTarget }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.averageUtilization, resourceData.averageValue, resourceData.type, resourceData.value].some(v => v !== undefined && v !== null));
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
                    { label: "Type", value: resourceData.type },
                    { label: "Value", value: resourceData.value || '-' }
                ]}
                columns={1}
            />

        </>
    )
}