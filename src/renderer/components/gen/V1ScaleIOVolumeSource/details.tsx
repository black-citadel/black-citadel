import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ScaleIOVolumeSource, V1LocalObjectReference } from "@utils/k8s-types";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const ScaleIOVolumeSourceDetails = ({ resourceData }: { resourceData: V1ScaleIOVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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
                <LocalObjectReferenceDetails resourceData={ resourceData.secretRef } />
            </Container>

        </>
    )
}