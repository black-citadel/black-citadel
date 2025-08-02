import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PodDisruptionBudgetStatus } from "@utils/k8s-types";
import { ConditionsTable } from "@components/base/conditions-table";

export const PodDisruptionBudgetStatusDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudgetStatus }): JSX.Element => {
    // Transform the Disrupted Pods object into an array of PanelGridItem objects
    const disruptedPodsItems = resourceData.disruptedPods
        ? Object.entries(resourceData.disruptedPods).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(disruptedPodsItems.length > 0);
        // Check simple properties
        checks.push([resourceData.currentHealthy, resourceData.desiredHealthy, resourceData.disruptionsAllowed, resourceData.expectedPods, resourceData.observedGeneration].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Disrupted Pods"
                items={ disruptedPodsItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Current Healthy", value: resourceData.currentHealthy },
                    { label: "Desired Healthy", value: resourceData.desiredHealthy },
                    { label: "Disruptions Allowed", value: resourceData.disruptionsAllowed },
                    { label: "Expected Pods", value: resourceData.expectedPods },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

        </>
    )
}