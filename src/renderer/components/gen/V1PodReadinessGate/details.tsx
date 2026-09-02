import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodReadinessGate } from "@kubernetes/client-node";

export const PodReadinessGateDetails = ({ resourceData }: { resourceData: V1PodReadinessGate }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.conditionType),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Condition Type", value: resourceData.conditionType, description: "ConditionType refers to a condition in the pod's condition list with matching type." },
                ]}
            />

        </>
    )
}
