import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodFailurePolicyOnPodConditionsPattern } from "@kubernetes/client-node";

export const PodFailurePolicyOnPodConditionsPatternDetails = ({ resourceData }: { resourceData: V1PodFailurePolicyOnPodConditionsPattern }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.status),
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Status", value: resourceData.status, description: "Specifies the required Pod condition status." },
                    { label: "Type", value: resourceData.type, description: "Specifies the required Pod condition type." },
                ]}
            />

        </>
    )
}
