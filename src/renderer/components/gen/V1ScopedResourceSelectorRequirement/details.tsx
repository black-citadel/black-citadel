import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ScopedResourceSelectorRequirement } from "@kubernetes/client-node";

export const ScopedResourceSelectorRequirementDetails = ({ resourceData }: { resourceData: V1ScopedResourceSelectorRequirement }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.operator),
        hasValue(resourceData.scopeName),
        hasValue(resourceData.values),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Operator", value: resourceData.operator, description: "Represents a scope's relationship to a set of values." },
                    { label: "Scope Name", value: resourceData.scopeName, description: "The name of the scope that the selector applies to." },
                    { label: "Values", value: resourceData.values, description: "An array of string values." },
                ]}
            />

        </>
    )
}
