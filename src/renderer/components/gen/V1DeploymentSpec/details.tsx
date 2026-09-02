import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DeploymentSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { DeploymentStrategyDetails } from "../V1DeploymentStrategy/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";

export const DeploymentSpecDetails = ({ resourceData }: { resourceData: V1DeploymentSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.replicas),
        hasValue(resourceData.minReadySeconds),
        hasValue(resourceData.progressDeadlineSeconds),
        hasValue(resourceData.revisionHistoryLimit),
        resourceData.paused === true,
        hasValue(resourceData.selector),
        hasValue(resourceData.strategy),
        hasValue(resourceData.template),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Replicas", value: resourceData.replicas, description: "Number of desired pods." },
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds, description: "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available." },
                    { label: "Progress Deadline Seconds", value: resourceData.progressDeadlineSeconds, description: "The maximum time in seconds for a deployment to make progress before it is considered to be failed." },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit, description: "The number of old ReplicaSets to retain to allow rollback." },
                ]}
                flags={[
                    { label: "Paused", value: resourceData.paused, description: "Indicates that the deployment is paused." },
                ]}
            />

            {hasValue(resourceData.selector) && (
                <Container title="Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.selector } />
                </Container>
            )}

            {hasValue(resourceData.strategy) && (
                <Container title="Strategy" collapsible defaultOpen={ true }>
                    <DeploymentStrategyDetails resourceData={resourceData.strategy } />
                </Container>
            )}

            {hasValue(resourceData.template) && (
                <Container title="Template" collapsible defaultOpen={ true }>
                    <PodTemplateSpecDetails resourceData={resourceData.template } />
                </Container>
            )}

        </>
    )
}
