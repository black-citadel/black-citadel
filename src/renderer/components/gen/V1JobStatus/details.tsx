import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1JobStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { UncountedTerminatedPodsDetails } from "../V1UncountedTerminatedPods/details";

export const JobStatusDetails = ({ resourceData }: { resourceData: V1JobStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.active, resourceData.completedIndexes, resourceData.failed, resourceData.failedIndexes, resourceData.ready, resourceData.succeeded, resourceData.terminating].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.uncountedTerminatedPods].some(v => v !== undefined && v !== null));
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
                    { label: "Active", value: resourceData.active || '-' },
                    { label: "Completed Indexes", value: resourceData.completedIndexes || '-' },
                    { label: "Failed", value: resourceData.failed || '-' },
                    { label: "Failed Indexes", value: resourceData.failedIndexes || '-' },
                    { label: "Ready", value: resourceData.ready || '-' },
                    { label: "Succeeded", value: resourceData.succeeded || '-' },
                    { label: "Terminating", value: resourceData.terminating || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

            {resourceData.uncountedTerminatedPods && (
                <Container title="Uncounted Terminated Pods">
                    <UncountedTerminatedPodsDetails resourceData={ resourceData.uncountedTerminatedPods } />
                </Container>
            )}

        </>
    )
}