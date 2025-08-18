import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1ReplicaSetStatus } from "@utils/k8s-types";
import { ReplicaSetConditionDetails } from "../V1ReplicaSetCondition/details";

export const ReplicaSetStatusDetails = ({ resourceData }: { resourceData: V1ReplicaSetStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.availableReplicas, resourceData.fullyLabeledReplicas, resourceData.observedGeneration, resourceData.readyReplicas, resourceData.replicas].some(v => v !== undefined && v !== null));
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
                    { label: "Fully Labeled Replicas", value: resourceData.fullyLabeledReplicas || '-' },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' },
                    { label: "Ready Replicas", value: resourceData.readyReplicas || '-' },
                    { label: "Replicas", value: resourceData.replicas }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <Container title="Conditions">
                    {resourceData.conditions.map((item, index) => (
                        <ReplicaSetConditionDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}