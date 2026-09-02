import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodFailurePolicyOnExitCodesRequirement } from "@kubernetes/client-node";

export const PodFailurePolicyOnExitCodesRequirementDetails = ({ resourceData }: { resourceData: V1PodFailurePolicyOnExitCodesRequirement }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.containerName),
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
                    { label: "Container Name", value: resourceData.containerName, description: "Restricts the check for exit codes to the container with the specified name." },
                    { label: "Operator", value: resourceData.operator, description: "Represents the relationship between the container exit code(s) and the specified values." },
                    { label: "Values", value: resourceData.values, description: "Specifies the set of values." },
                ]}
            />

        </>
    )
}
