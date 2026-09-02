import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1StatefulSetSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";
import { PersistentVolumeClaimDetails } from "../V1PersistentVolumeClaim/details";
import { StatefulSetUpdateStrategyDetails } from "../V1StatefulSetUpdateStrategy/details";
import { StatefulSetPersistentVolumeClaimRetentionPolicyDetails } from "../V1StatefulSetPersistentVolumeClaimRetentionPolicy/details";
import { StatefulSetOrdinalsDetails } from "../V1StatefulSetOrdinals/details";

export const StatefulSetSpecDetails = ({ resourceData }: { resourceData: V1StatefulSetSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.replicas),
        hasValue(resourceData.serviceName),
        hasValue(resourceData.podManagementPolicy),
        hasValue(resourceData.minReadySeconds),
        hasValue(resourceData.revisionHistoryLimit),
        hasValue(resourceData.selector),
        hasValue(resourceData.template),
        hasValue(resourceData.volumeClaimTemplates),
        hasValue(resourceData.updateStrategy),
        hasValue(resourceData.persistentVolumeClaimRetentionPolicy),
        hasValue(resourceData.ordinals),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Replicas", value: resourceData.replicas, description: "replicas is the desired number of replicas of the given Template." },
                    { label: "Service Name", value: resourceData.serviceName, description: "serviceName is the name of the service that governs this StatefulSet." },
                    { label: "Pod Management Policy", value: resourceData.podManagementPolicy, description: "podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down." },
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds, description: "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available." },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit, description: "revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history." },
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

            {hasValue(resourceData.volumeClaimTemplates) && (
                <Container title="Volume Claim Templates" count={resourceData.volumeClaimTemplates.length} collapsible defaultOpen={ true }>
                    {resourceData.volumeClaimTemplates.map((item, index) => (
                        <PanelListItem key={index}>
                            <PersistentVolumeClaimDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.updateStrategy) && (
                <Container title="Update Strategy" collapsible defaultOpen={ false }>
                    <StatefulSetUpdateStrategyDetails resourceData={resourceData.updateStrategy } />
                </Container>
            )}

            {hasValue(resourceData.persistentVolumeClaimRetentionPolicy) && (
                <Container title="Persistent Volume Claim Retention Policy" collapsible defaultOpen={ false }>
                    <StatefulSetPersistentVolumeClaimRetentionPolicyDetails resourceData={resourceData.persistentVolumeClaimRetentionPolicy } />
                </Container>
            )}

            {hasValue(resourceData.ordinals) && (
                <Container title="Ordinals" collapsible defaultOpen={ false }>
                    <StatefulSetOrdinalsDetails resourceData={resourceData.ordinals } />
                </Container>
            )}

        </>
    )
}
