import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ReplicaSetSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";

export const ReplicaSetSpecDetails = ({ resourceData }: { resourceData: V1ReplicaSetSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.replicas),
        hasValue(resourceData.minReadySeconds),
        hasValue(resourceData.selector),
        hasValue(resourceData.template),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Replicas", value: resourceData.replicas, description: "Replicas is the number of desired replicas." },
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds, description: "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available." },
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

        </>
    )
}
