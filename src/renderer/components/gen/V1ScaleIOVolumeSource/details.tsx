import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ScaleIOVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const ScaleIOVolumeSourceDetails = ({ resourceData }: { resourceData: V1ScaleIOVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.gateway),
        hasValue(resourceData.protectionDomain),
        hasValue(resourceData.storageMode),
        hasValue(resourceData.storagePool),
        hasValue(resourceData.system),
        hasValue(resourceData.volumeName),
        resourceData.readOnly === true,
        resourceData.sslEnabled === true,
        hasValue(resourceData.secretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                    { label: "Gateway", value: resourceData.gateway, description: "gateway is the host address of the ScaleIO API Gateway." },
                    { label: "Protection Domain", value: resourceData.protectionDomain, description: "protectionDomain is the name of the ScaleIO Protection Domain for the configured storage." },
                    { label: "Storage Mode", value: resourceData.storageMode, description: "storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned." },
                    { label: "Storage Pool", value: resourceData.storagePool, description: "storagePool is the ScaleIO Storage Pool associated with the protection domain." },
                    { label: "System", value: resourceData.system, description: "system is the name of the storage system as configured in ScaleIO." },
                    { label: "Volume Name", value: resourceData.volumeName, description: "volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly Defaults to false (read/write)." },
                    { label: "Ssl Enabled", value: resourceData.sslEnabled, description: "sslEnabled Flag enable/disable SSL communication with Gateway, default false" },
                ]}
            />

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <LocalObjectReferenceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
