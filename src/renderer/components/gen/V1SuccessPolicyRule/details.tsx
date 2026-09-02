import { PanelGrid } from "@components/layout/panel";
import type { V1SuccessPolicyRule } from "@kubernetes/client-node";

export const SuccessPolicyRuleDetails = ({ resourceData }: { resourceData: V1SuccessPolicyRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.succeededCount, resourceData.succeededIndexes].some(v => v !== undefined && v !== null));
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
                    { label: "Succeeded Count", value: resourceData.succeededCount || '-' },
                    { label: "Succeeded Indexes", value: resourceData.succeededIndexes || '-' }
                ]}
                columns={1}
            />

        </>
    )
}