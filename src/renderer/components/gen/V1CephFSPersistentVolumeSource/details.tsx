import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CephFSPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const CephFSPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1CephFSPersistentVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.monitors),
        hasValue(resourceData.path),
        hasValue(resourceData.secretFile),
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
                    { label: "Monitors", value: resourceData.monitors, description: "monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it" },
                    { label: "Path", value: resourceData.path, description: "path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /" },
                    { label: "Secret File", value: resourceData.secretFile, description: "secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.…" },
                    { label: "User", value: resourceData.user, description: "user is Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it" },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly is Optional: Defaults to false (read/write)." },
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
