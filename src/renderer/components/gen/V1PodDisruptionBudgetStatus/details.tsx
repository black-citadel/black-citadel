import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodDisruptionBudgetStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";

export const PodDisruptionBudgetStatusDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudgetStatus }): JSX.Element => {
    const disruptedPodsItems = Object.entries(resourceData.disruptedPods ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        disruptedPodsItems.length > 0,
        hasValue(resourceData.currentHealthy),
        hasValue(resourceData.desiredHealthy),
        hasValue(resourceData.disruptionsAllowed),
        hasValue(resourceData.expectedPods),
        hasValue(resourceData.observedGeneration),
        hasValue(resourceData.conditions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Current Healthy", value: resourceData.currentHealthy, description: "current number of healthy pods" },
                    { label: "Desired Healthy", value: resourceData.desiredHealthy, description: "minimum desired number of healthy pods" },
                    { label: "Disruptions Allowed", value: resourceData.disruptionsAllowed, description: "Number of pod disruptions that are currently allowed." },
                    { label: "Expected Pods", value: resourceData.expectedPods, description: "total number of pods counted by this disruption budget" },
                    { label: "Observed Generation", value: resourceData.observedGeneration, description: "Most recent generation observed when updating this PDB status." },
                ]}
            />

            <PanelGrid title="Disrupted Pods" items={ disruptedPodsItems } />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

        </>
    )
}
