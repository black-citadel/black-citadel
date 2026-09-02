import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodAffinityTerm } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const PodAffinityTermDetails = ({ resourceData }: { resourceData: V1PodAffinityTerm }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.matchLabelKeys),
        hasValue(resourceData.mismatchLabelKeys),
        hasValue(resourceData.namespaces),
        hasValue(resourceData.topologyKey),
        hasValue(resourceData.labelSelector),
        hasValue(resourceData.namespaceSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Match Label Keys", value: resourceData.matchLabelKeys, description: "MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration." },
                    { label: "Mismatch Label Keys", value: resourceData.mismatchLabelKeys, description: "MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration." },
                    { label: "Namespaces", value: resourceData.namespaces, description: "namespaces specifies a static list of namespace names that the term applies to." },
                    { label: "Topology Key", value: resourceData.topologyKey, description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-locat…" },
                ]}
            />

            {hasValue(resourceData.labelSelector) && (
                <Container title="Label Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.labelSelector } />
                </Container>
            )}

            {hasValue(resourceData.namespaceSelector) && (
                <Container title="Namespace Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.namespaceSelector } />
                </Container>
            )}

        </>
    )
}
