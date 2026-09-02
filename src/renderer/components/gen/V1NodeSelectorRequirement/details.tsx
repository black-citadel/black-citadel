import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1NodeSelectorRequirement } from "@kubernetes/client-node";

export const NodeSelectorRequirementDetails = ({ resourceData }: { resourceData: V1NodeSelectorRequirement }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.key),
        hasValue(resourceData.operator),
        hasValue(resourceData.values),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Key", value: resourceData.key, description: "The label key that the selector applies to." },
                    { label: "Operator", value: resourceData.operator, description: "Represents a key's relationship to a set of values." },
                    { label: "Values", value: resourceData.values, description: "An array of string values." },
                ]}
            />

        </>
    )
}
