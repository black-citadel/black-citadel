import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1StatefulSetSpec } from "@kubernetes/client-node";
import { StatefulSetOrdinalsDetails } from "../V1StatefulSetOrdinals/details";
import { StatefulSetPersistentVolumeClaimRetentionPolicyDetails } from "../V1StatefulSetPersistentVolumeClaimRetentionPolicy/details";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";
import { StatefulSetUpdateStrategyDetails } from "../V1StatefulSetUpdateStrategy/details";
import { PersistentVolumeClaimDetails } from "../V1PersistentVolumeClaim/details";

export const StatefulSetSpecDetails = ({ resourceData }: { resourceData: V1StatefulSetSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.minReadySeconds, resourceData.podManagementPolicy, resourceData.replicas, resourceData.revisionHistoryLimit, resourceData.serviceName].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.ordinals, resourceData.persistentVolumeClaimRetentionPolicy, resourceData.selector, resourceData.template, resourceData.updateStrategy, resourceData.volumeClaimTemplates].some(v => v !== undefined && v !== null));
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
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds || '-' },
                    { label: "Pod Management Policy", value: resourceData.podManagementPolicy || '-' },
                    { label: "Replicas", value: resourceData.replicas || '-' },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit || '-' },
                    { label: "Service Name", value: resourceData.serviceName }
                ]}
                columns={1}
            />

            {resourceData.ordinals && (
                <Container title="Ordinals">
                    <StatefulSetOrdinalsDetails resourceData={ resourceData.ordinals } />
                </Container>
            )}

            {resourceData.persistentVolumeClaimRetentionPolicy && (
                <Container title="Persistent Volume Claim Retention Policy">
                    <StatefulSetPersistentVolumeClaimRetentionPolicyDetails resourceData={ resourceData.persistentVolumeClaimRetentionPolicy } />
                </Container>
            )}

            <Container title="Selector">
                <LabelSelectorDetails resourceData={ resourceData.selector } />
            </Container>

            <Container title="Template">
                <PodTemplateSpecDetails resourceData={ resourceData.template } />
            </Container>

            {resourceData.updateStrategy && (
                <Container title="Update Strategy">
                    <StatefulSetUpdateStrategyDetails resourceData={ resourceData.updateStrategy } />
                </Container>
            )}

            {resourceData.volumeClaimTemplates && (
                <Container title="Volume Claim Templates">
                    {resourceData.volumeClaimTemplates.map((item, index) => (
                        <PersistentVolumeClaimDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}