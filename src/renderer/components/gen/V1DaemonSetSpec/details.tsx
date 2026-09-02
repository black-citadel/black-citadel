import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DaemonSetSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";
import { DaemonSetUpdateStrategyDetails } from "../V1DaemonSetUpdateStrategy/details";

export const DaemonSetSpecDetails = ({ resourceData }: { resourceData: V1DaemonSetSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.minReadySeconds),
        hasValue(resourceData.revisionHistoryLimit),
        hasValue(resourceData.selector),
        hasValue(resourceData.template),
        hasValue(resourceData.updateStrategy),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds, description: "The minimum number of seconds for which a newly created DaemonSet pod should be ready without any of its container crashing, for it to be considered available." },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit, description: "The number of old history to retain to allow rollback." },
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

            {hasValue(resourceData.updateStrategy) && (
                <Container title="Update Strategy" collapsible defaultOpen={ false }>
                    <DaemonSetUpdateStrategyDetails resourceData={resourceData.updateStrategy } />
                </Container>
            )}

        </>
    )
}
