import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ScaleIOPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const ScaleIOPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1ScaleIOPersistentVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.fsType, resourceData.gateway, resourceData.protectionDomain, resourceData.storageMode, resourceData.storagePool, resourceData.system, resourceData.volumeName].some(v => v !== undefined && v !== null));
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
                    { label: "Gateway", value: resourceData.gateway },
                    { label: "Protection Domain", value: resourceData.protectionDomain || '-' },
                    { label: "Storage Mode", value: resourceData.storageMode || '-' },
                    { label: "Storage Pool", value: resourceData.storagePool || '-' },
                    { label: "System", value: resourceData.system },
                    { label: "Volume Name", value: resourceData.volumeName || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" },
                    { label: "Ssl Enabled", value: resourceData.sslEnabled ? "Yes" : "No" }
                ]}
                columns={1}
            />

            <Container title="Secret Ref">
                <SecretReferenceDetails resourceData={ resourceData.secretRef } />
            </Container>

        </>
    )
}