import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1RBDVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const RBDVolumeSourceDetails = ({ resourceData }: { resourceData: V1RBDVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.image),
        hasValue(resourceData.keyring),
        hasValue(resourceData.monitors),
        hasValue(resourceData.pool),
        hasValue(resourceData.user),
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
                    { label: "Image", value: resourceData.image, description: "image is the rados image name." },
                    { label: "Keyring", value: resourceData.keyring, description: "keyring is the path to key ring for RBDUser." },
                    { label: "Monitors", value: resourceData.monitors, description: "monitors is a collection of Ceph monitors." },
                    { label: "Pool", value: resourceData.pool, description: "pool is the rados pool name." },
                    { label: "User", value: resourceData.user, description: "user is the rados user name." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the ReadOnly setting in VolumeMounts." },
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
