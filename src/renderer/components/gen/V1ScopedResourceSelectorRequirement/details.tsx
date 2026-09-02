import { PanelGrid } from "@components/layout/panel";
import type { V1ScopedResourceSelectorRequirement } from "@kubernetes/client-node";

export const ScopedResourceSelectorRequirementDetails = ({ resourceData }: { resourceData: V1ScopedResourceSelectorRequirement }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.operator, resourceData.scopeName].some(v => v !== undefined && v !== null));
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
                    { label: "Operator", value: resourceData.operator },
                    { label: "Scope Name", value: resourceData.scopeName }
                ]}
                columns={1}
            />

        </>
    )
}