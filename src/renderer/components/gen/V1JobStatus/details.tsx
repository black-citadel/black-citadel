import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1JobStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { UncountedTerminatedPodsDetails } from "../V1UncountedTerminatedPods/details";

export const JobStatusDetails = ({ resourceData }: { resourceData: V1JobStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.active),
        hasValue(resourceData.completedIndexes),
        hasValue(resourceData.completionTime),
        hasValue(resourceData.failed),
        hasValue(resourceData.failedIndexes),
        hasValue(resourceData.ready),
        hasValue(resourceData.startTime),
        hasValue(resourceData.succeeded),
        hasValue(resourceData.terminating),
        hasValue(resourceData.conditions),
        hasValue(resourceData.uncountedTerminatedPods),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Active", value: resourceData.active, description: "The number of pending and running pods which are not terminating (without a deletionTimestamp)." },
                    { label: "Completed Indexes", value: resourceData.completedIndexes, description: "completedIndexes holds the completed indexes when .spec.completionMode = \"Indexed\" in a text format." },
                    { label: "Completion Time", value: resourceData.completionTime, description: "Represents time when the job was completed." },
                    { label: "Failed", value: resourceData.failed, description: "The number of pods which reached phase Failed." },
                    { label: "Failed Indexes", value: resourceData.failedIndexes, description: "FailedIndexes holds the failed indexes when spec.backoffLimitPerIndex is set." },
                    { label: "Ready", value: resourceData.ready, description: "The number of pods which have a Ready condition." },
                    { label: "Start Time", value: resourceData.startTime, description: "Represents time when the job controller started processing a job." },
                    { label: "Succeeded", value: resourceData.succeeded, description: "The number of pods which reached phase Succeeded." },
                    { label: "Terminating", value: resourceData.terminating, description: "The number of pods which are terminating (in phase Pending or Running and have a deletionTimestamp)." },
                ]}
            />

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

            {hasValue(resourceData.uncountedTerminatedPods) && (
                <Container title="Uncounted Terminated Pods" collapsible defaultOpen={ true }>
                    <UncountedTerminatedPodsDetails resourceData={resourceData.uncountedTerminatedPods } />
                </Container>
            )}

        </>
    )
}
