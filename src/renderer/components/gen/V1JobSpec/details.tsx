import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1JobSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";
import { PodFailurePolicyDetails } from "../V1PodFailurePolicy/details";
import { SuccessPolicyDetails } from "../V1SuccessPolicy/details";

export const JobSpecDetails = ({ resourceData }: { resourceData: V1JobSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.parallelism),
        hasValue(resourceData.completions),
        hasValue(resourceData.completionMode),
        hasValue(resourceData.backoffLimit),
        hasValue(resourceData.activeDeadlineSeconds),
        hasValue(resourceData.ttlSecondsAfterFinished),
        hasValue(resourceData.backoffLimitPerIndex),
        hasValue(resourceData.managedBy),
        hasValue(resourceData.maxFailedIndexes),
        hasValue(resourceData.podReplacementPolicy),
        resourceData.suspend === true,
        resourceData.manualSelector === true,
        hasValue(resourceData.selector),
        hasValue(resourceData.template),
        hasValue(resourceData.podFailurePolicy),
        hasValue(resourceData.successPolicy),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Parallelism", value: resourceData.parallelism, description: "Specifies the maximum desired number of pods the job should run at any given time." },
                    { label: "Completions", value: resourceData.completions, description: "Specifies the desired number of successfully finished pods the job should be run with." },
                    { label: "Completion Mode", value: resourceData.completionMode, description: "completionMode specifies how Pod completions are tracked." },
                    { label: "Backoff Limit", value: resourceData.backoffLimit, description: "Specifies the number of retries before marking this job failed." },
                    { label: "Active Deadline Seconds", value: resourceData.activeDeadlineSeconds, description: "Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be posi…" },
                    { label: "Ttl Seconds After Finished", value: resourceData.ttlSecondsAfterFinished, description: "ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed)." },
                    { label: "Backoff Limit Per Index", value: resourceData.backoffLimitPerIndex, description: "Specifies the limit for the number of retries within an index before marking this index as failed." },
                    { label: "Managed By", value: resourceData.managedBy, description: "ManagedBy field indicates the controller that manages a Job." },
                    { label: "Max Failed Indexes", value: resourceData.maxFailedIndexes, description: "Specifies the maximal number of failed indexes before marking the Job as failed, when backoffLimitPerIndex is set." },
                    { label: "Pod Replacement Policy", value: resourceData.podReplacementPolicy, description: "podReplacementPolicy specifies when to create replacement Pods." },
                ]}
                flags={[
                    { label: "Suspend", value: resourceData.suspend, description: "suspend specifies whether the Job controller should create Pods or not." },
                    { label: "Manual Selector", value: resourceData.manualSelector, description: "manualSelector controls generation of pod labels and pod selectors." },
                ]}
            />

            {hasValue(resourceData.selector) && (
                <Container title="Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.selector } />
                </Container>
            )}

            {hasValue(resourceData.template) && (
                <Container title="Template" collapsible defaultOpen={ true }>
                    <PodTemplateSpecDetails resourceData={resourceData.template } />
                </Container>
            )}

            {hasValue(resourceData.podFailurePolicy) && (
                <Container title="Pod Failure Policy" collapsible defaultOpen={ false }>
                    <PodFailurePolicyDetails resourceData={resourceData.podFailurePolicy } />
                </Container>
            )}

            {hasValue(resourceData.successPolicy) && (
                <Container title="Success Policy" collapsible defaultOpen={ true }>
                    <SuccessPolicyDetails resourceData={resourceData.successPolicy } />
                </Container>
            )}

        </>
    )
}
