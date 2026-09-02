import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ISCSIPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const ISCSIPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1ISCSIPersistentVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.initiatorName),
        hasValue(resourceData.iqn),
        hasValue(resourceData.iscsiInterface),
        hasValue(resourceData.lun),
        hasValue(resourceData.portals),
        hasValue(resourceData.targetPortal),
        resourceData.chapAuthDiscovery === true,
        resourceData.chapAuthSession === true,
        resourceData.readOnly === true,
        hasValue(resourceData.secretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type of the volume that you want to mount." },
                    { label: "Initiator Name", value: resourceData.initiatorName, description: "initiatorName is the custom iSCSI Initiator Name." },
                    { label: "Iqn", value: resourceData.iqn, description: "iqn is Target iSCSI Qualified Name." },
                    { label: "Iscsi Interface", value: resourceData.iscsiInterface, description: "iscsiInterface is the interface Name that uses an iSCSI transport." },
                    { label: "Lun", value: resourceData.lun, description: "lun is iSCSI Target Lun number." },
                    { label: "Portals", value: resourceData.portals, description: "portals is the iSCSI Target Portal List." },
                    { label: "Target Portal", value: resourceData.targetPortal, description: "targetPortal is iSCSI Target Portal." },
                ]}
                flags={[
                    { label: "Chap Auth Discovery", value: resourceData.chapAuthDiscovery, description: "chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication" },
                    { label: "Chap Auth Session", value: resourceData.chapAuthSession, description: "chapAuthSession defines whether support iSCSI Session CHAP authentication" },
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the ReadOnly setting in VolumeMounts." },
                ]}
            />

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <SecretReferenceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
