import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SuccessPolicyRule } from "@kubernetes/client-node";

export const SuccessPolicyRuleDetails = ({ resourceData }: { resourceData: V1SuccessPolicyRule }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.succeededCount),
        hasValue(resourceData.succeededIndexes),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Succeeded Count", value: resourceData.succeededCount, description: "succeededCount specifies the minimal required size of the actual set of the succeeded indexes for the Job." },
                    { label: "Succeeded Indexes", value: resourceData.succeededIndexes, description: "succeededIndexes specifies the set of indexes which need to be contained in the actual set of the succeeded indexes for the Job." },
                ]}
            />

        </>
    )
}
