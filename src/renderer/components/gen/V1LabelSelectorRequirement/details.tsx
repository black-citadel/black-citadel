import { PanelGrid } from "@components/layout/panel";
import type { V1LabelSelectorRequirement } from "@kubernetes/client-node";

export const LabelSelectorRequirementDetails = ({ resourceData }: { resourceData: V1LabelSelectorRequirement }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.key, resourceData.operator].some(v => v !== undefined && v !== null));
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
                    { label: "Key", value: resourceData.key },
                    { label: "Operator", value: resourceData.operator }
                ]}
                columns={1}
            />

        </>
    )
}