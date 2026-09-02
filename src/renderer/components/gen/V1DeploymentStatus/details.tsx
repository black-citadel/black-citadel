import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DeploymentStatus } from "@kubernetes/client-node";
import { DeploymentConditionDetails } from "../V1DeploymentCondition/details";

export const DeploymentStatusDetails = ({ resourceData }: { resourceData: V1DeploymentStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.availableReplicas, resourceData.collisionCount, resourceData.observedGeneration, resourceData.readyReplicas, resourceData.replicas, resourceData.unavailableReplicas, resourceData.updatedReplicas].some(v => v !== undefined && v !== null));
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
                title="Properties"
                items={[
                    { label: "Available Replicas", value: resourceData.availableReplicas || '-' },
                    { label: "Collision Count", value: resourceData.collisionCount || '-' },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' },
                    { label: "Ready Replicas", value: resourceData.readyReplicas || '-' },
                    { label: "Replicas", value: resourceData.replicas || '-' },
                    { label: "Unavailable Replicas", value: resourceData.unavailableReplicas || '-' },
                    { label: "Updated Replicas", value: resourceData.updatedReplicas || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <Container title="Conditions">
                    {resourceData.conditions.map((item, index) => (
                        <DeploymentConditionDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}