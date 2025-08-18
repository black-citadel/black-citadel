import { PanelGrid } from "@components/layout/panel";
import { V1RollingUpdateStatefulSetStrategy } from "@utils/k8s-types";

export const RollingUpdateStatefulSetStrategyDetails = ({ resourceData }: { resourceData: V1RollingUpdateStatefulSetStrategy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.maxUnavailable, resourceData.partition].some(v => v !== undefined && v !== null));
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
                    { label: "Max Unavailable", value: resourceData.maxUnavailable || '-' },
                    { label: "Partition", value: resourceData.partition || '-' }
                ]}
                columns={1}
            />

        </>
    )
}