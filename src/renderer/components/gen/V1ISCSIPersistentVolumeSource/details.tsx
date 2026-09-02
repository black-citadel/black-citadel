import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ISCSIPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const ISCSIPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1ISCSIPersistentVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.fsType, resourceData.initiatorName, resourceData.iqn, resourceData.iscsiInterface, resourceData.lun, resourceData.targetPortal].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.secretRef].some(v => v !== undefined && v !== null));
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
                    { label: "Fs Type", value: resourceData.fsType || '-' },
                    { label: "Initiator Name", value: resourceData.initiatorName || '-' },
                    { label: "Iqn", value: resourceData.iqn },
                    { label: "Iscsi Interface", value: resourceData.iscsiInterface || '-' },
                    { label: "Lun", value: resourceData.lun },
                    { label: "Target Portal", value: resourceData.targetPortal }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Chap Auth Discovery", value: resourceData.chapAuthDiscovery ? "Yes" : "No" },
                    { label: "Chap Auth Session", value: resourceData.chapAuthSession ? "Yes" : "No" },
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.secretRef && (
                <Container title="Secret Ref">
                    <SecretReferenceDetails resourceData={ resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}