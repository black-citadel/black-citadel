import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1LabelSelectorRequirement } from "@kubernetes/client-node";

export const LabelSelectorRequirementDetails = ({ resourceData }: { resourceData: V1LabelSelectorRequirement }): JSX.Element => {

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
                    { label: "Key", value: resourceData.key, description: "key is the label key that the selector applies to." },
                    { label: "Operator", value: resourceData.operator, description: "operator represents a key's relationship to a set of values." },
                    { label: "Values", value: resourceData.values, description: "values is an array of string values." },
                ]}
            />

        </>
    )
}
