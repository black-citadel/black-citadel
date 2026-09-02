import { PanelGrid } from "@components/layout/panel";
import type { V1PodFailurePolicyOnExitCodesRequirement } from "@kubernetes/client-node";

export const PodFailurePolicyOnExitCodesRequirementDetails = ({ resourceData }: { resourceData: V1PodFailurePolicyOnExitCodesRequirement }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.containerName, resourceData.operator].some(v => v !== undefined && v !== null));
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
                    { label: "Container Name", value: resourceData.containerName || '-' },
                    { label: "Operator", value: resourceData.operator }
                ]}
                columns={1}
            />

        </>
    )
}