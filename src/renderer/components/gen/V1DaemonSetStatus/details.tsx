import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DaemonSetStatus } from "@kubernetes/client-node";
import { DaemonSetConditionDetails } from "../V1DaemonSetCondition/details";

export const DaemonSetStatusDetails = ({ resourceData }: { resourceData: V1DaemonSetStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.collisionCount, resourceData.currentNumberScheduled, resourceData.desiredNumberScheduled, resourceData.numberAvailable, resourceData.numberMisscheduled, resourceData.numberReady, resourceData.numberUnavailable, resourceData.observedGeneration, resourceData.updatedNumberScheduled].some(v => v !== undefined && v !== null));
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
                    { label: "Collision Count", value: resourceData.collisionCount || '-' },
                    { label: "Current Number Scheduled", value: resourceData.currentNumberScheduled },
                    { label: "Desired Number Scheduled", value: resourceData.desiredNumberScheduled },
                    { label: "Number Available", value: resourceData.numberAvailable || '-' },
                    { label: "Number Misscheduled", value: resourceData.numberMisscheduled },
                    { label: "Number Ready", value: resourceData.numberReady },
                    { label: "Number Unavailable", value: resourceData.numberUnavailable || '-' },
                    { label: "Observed Generation", value: resourceData.observedGeneration || '-' },
                    { label: "Updated Number Scheduled", value: resourceData.updatedNumberScheduled || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <Container title="Conditions">
                    {resourceData.conditions.map((item, index) => (
                        <DaemonSetConditionDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}