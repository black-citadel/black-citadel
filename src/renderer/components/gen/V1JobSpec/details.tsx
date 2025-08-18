import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1JobSpec } from "@utils/k8s-types";
import { PodFailurePolicyDetails } from "../V1PodFailurePolicy/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { SuccessPolicyDetails } from "../V1SuccessPolicy/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";

export const JobSpecDetails = ({ resourceData }: { resourceData: V1JobSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.activeDeadlineSeconds, resourceData.backoffLimit, resourceData.backoffLimitPerIndex, resourceData.completionMode, resourceData.completions, resourceData.managedBy, resourceData.maxFailedIndexes, resourceData.parallelism, resourceData.podReplacementPolicy, resourceData.ttlSecondsAfterFinished].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.podFailurePolicy, resourceData.selector, resourceData.successPolicy, resourceData.template].some(v => v !== undefined && v !== null));
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
                    { label: "Active Deadline Seconds", value: resourceData.activeDeadlineSeconds || '-' },
                    { label: "Backoff Limit", value: resourceData.backoffLimit || '-' },
                    { label: "Backoff Limit Per Index", value: resourceData.backoffLimitPerIndex || '-' },
                    { label: "Completion Mode", value: resourceData.completionMode || '-' },
                    { label: "Completions", value: resourceData.completions || '-' },
                    { label: "Managed By", value: resourceData.managedBy || '-' },
                    { label: "Max Failed Indexes", value: resourceData.maxFailedIndexes || '-' },
                    { label: "Parallelism", value: resourceData.parallelism || '-' },
                    { label: "Pod Replacement Policy", value: resourceData.podReplacementPolicy || '-' },
                    { label: "Ttl Seconds After Finished", value: resourceData.ttlSecondsAfterFinished || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Manual Selector", value: resourceData.manualSelector ? "Yes" : "No" },
                    { label: "Suspend", value: resourceData.suspend ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.podFailurePolicy && (
                <Container title="Pod Failure Policy">
                    <PodFailurePolicyDetails resourceData={ resourceData.podFailurePolicy } />
                </Container>
            )}

            {resourceData.selector && (
                <Container title="Selector">
                    <LabelSelectorDetails resourceData={ resourceData.selector } />
                </Container>
            )}

            {resourceData.successPolicy && (
                <Container title="Success Policy">
                    <SuccessPolicyDetails resourceData={ resourceData.successPolicy } />
                </Container>
            )}

            <Container title="Template">
                <PodTemplateSpecDetails resourceData={ resourceData.template } />
            </Container>

        </>
    )
}