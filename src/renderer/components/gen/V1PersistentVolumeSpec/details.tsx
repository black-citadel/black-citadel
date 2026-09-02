import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PersistentVolumeSpec } from "@kubernetes/client-node";
import { AWSElasticBlockStoreVolumeSourceDetails } from "../V1AWSElasticBlockStoreVolumeSource/details";
import { AzureDiskVolumeSourceDetails } from "../V1AzureDiskVolumeSource/details";
import { AzureFilePersistentVolumeSourceDetails } from "../V1AzureFilePersistentVolumeSource/details";
import { CephFSPersistentVolumeSourceDetails } from "../V1CephFSPersistentVolumeSource/details";
import { CinderPersistentVolumeSourceDetails } from "../V1CinderPersistentVolumeSource/details";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";
import { CSIPersistentVolumeSourceDetails } from "../V1CSIPersistentVolumeSource/details";
import { FCVolumeSourceDetails } from "../V1FCVolumeSource/details";
import { FlexPersistentVolumeSourceDetails } from "../V1FlexPersistentVolumeSource/details";
import { FlockerVolumeSourceDetails } from "../V1FlockerVolumeSource/details";
import { GCEPersistentDiskVolumeSourceDetails } from "../V1GCEPersistentDiskVolumeSource/details";
import { GlusterfsPersistentVolumeSourceDetails } from "../V1GlusterfsPersistentVolumeSource/details";
import { HostPathVolumeSourceDetails } from "../V1HostPathVolumeSource/details";
import { ISCSIPersistentVolumeSourceDetails } from "../V1ISCSIPersistentVolumeSource/details";
import { LocalVolumeSourceDetails } from "../V1LocalVolumeSource/details";
import { NFSVolumeSourceDetails } from "../V1NFSVolumeSource/details";
import { VolumeNodeAffinityDetails } from "../V1VolumeNodeAffinity/details";
import { PhotonPersistentDiskVolumeSourceDetails } from "../V1PhotonPersistentDiskVolumeSource/details";
import { PortworxVolumeSourceDetails } from "../V1PortworxVolumeSource/details";
import { QuobyteVolumeSourceDetails } from "../V1QuobyteVolumeSource/details";
import { RBDPersistentVolumeSourceDetails } from "../V1RBDPersistentVolumeSource/details";
import { ScaleIOPersistentVolumeSourceDetails } from "../V1ScaleIOPersistentVolumeSource/details";
import { StorageOSPersistentVolumeSourceDetails } from "../V1StorageOSPersistentVolumeSource/details";
import { VsphereVirtualDiskVolumeSourceDetails } from "../V1VsphereVirtualDiskVolumeSource/details";

export const PersistentVolumeSpecDetails = ({ resourceData }: { resourceData: V1PersistentVolumeSpec }): JSX.Element => {
    const capacityItems = Object.entries(resourceData.capacity ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        capacityItems.length > 0,
        hasValue(resourceData.accessModes),
        hasValue(resourceData.mountOptions),
        hasValue(resourceData.persistentVolumeReclaimPolicy),
        hasValue(resourceData.storageClassName),
        hasValue(resourceData.volumeAttributesClassName),
        hasValue(resourceData.volumeMode),
        hasValue(resourceData.awsElasticBlockStore),
        hasValue(resourceData.azureDisk),
        hasValue(resourceData.azureFile),
        hasValue(resourceData.cephfs),
        hasValue(resourceData.cinder),
        hasValue(resourceData.claimRef),
        hasValue(resourceData.csi),
        hasValue(resourceData.fc),
        hasValue(resourceData.flexVolume),
        hasValue(resourceData.flocker),
        hasValue(resourceData.gcePersistentDisk),
        hasValue(resourceData.glusterfs),
        hasValue(resourceData.hostPath),
        hasValue(resourceData.iscsi),
        hasValue(resourceData.local),
        hasValue(resourceData.nfs),
        hasValue(resourceData.nodeAffinity),
        hasValue(resourceData.photonPersistentDisk),
        hasValue(resourceData.portworxVolume),
        hasValue(resourceData.quobyte),
        hasValue(resourceData.rbd),
        hasValue(resourceData.scaleIO),
        hasValue(resourceData.storageos),
        hasValue(resourceData.vsphereVolume),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Access Modes", value: resourceData.accessModes, description: "accessModes contains all ways the volume can be mounted." },
                    { label: "Mount Options", value: resourceData.mountOptions, description: "mountOptions is the list of mount options, e.g." },
                    { label: "Persistent Volume Reclaim Policy", value: resourceData.persistentVolumeReclaimPolicy, description: "persistentVolumeReclaimPolicy defines what happens to a persistent volume when released from its claim." },
                    { label: "Storage Class Name", value: resourceData.storageClassName, description: "storageClassName is the name of StorageClass to which this persistent volume belongs." },
                    { label: "Volume Attributes Class Name", value: resourceData.volumeAttributesClassName, description: "Name of VolumeAttributesClass to which this persistent volume belongs." },
                    { label: "Volume Mode", value: resourceData.volumeMode, description: "volumeMode defines if a volume is intended to be used with a formatted filesystem or to remain in raw block state." },
                ]}
            />

            <PanelGrid title="Capacity" items={ capacityItems } />

            {hasValue(resourceData.awsElasticBlockStore) && (
                <Container title="Aws Elastic Block Store" collapsible defaultOpen={ true }>
                    <AWSElasticBlockStoreVolumeSourceDetails resourceData={resourceData.awsElasticBlockStore } />
                </Container>
            )}

            {hasValue(resourceData.azureDisk) && (
                <Container title="Azure Disk" collapsible defaultOpen={ true }>
                    <AzureDiskVolumeSourceDetails resourceData={resourceData.azureDisk } />
                </Container>
            )}

            {hasValue(resourceData.azureFile) && (
                <Container title="Azure File" collapsible defaultOpen={ true }>
                    <AzureFilePersistentVolumeSourceDetails resourceData={resourceData.azureFile } />
                </Container>
            )}

            {hasValue(resourceData.cephfs) && (
                <Container title="Cephfs" collapsible defaultOpen={ true }>
                    <CephFSPersistentVolumeSourceDetails resourceData={resourceData.cephfs } />
                </Container>
            )}

            {hasValue(resourceData.cinder) && (
                <Container title="Cinder" collapsible defaultOpen={ true }>
                    <CinderPersistentVolumeSourceDetails resourceData={resourceData.cinder } />
                </Container>
            )}

            {hasValue(resourceData.claimRef) && (
                <Container title="Claim Ref" collapsible defaultOpen={ true }>
                    <ObjectReferenceDetails resourceData={resourceData.claimRef } />
                </Container>
            )}

            {hasValue(resourceData.csi) && (
                <Container title="Csi" collapsible defaultOpen={ true }>
                    <CSIPersistentVolumeSourceDetails resourceData={resourceData.csi } />
                </Container>
            )}

            {hasValue(resourceData.fc) && (
                <Container title="Fc" collapsible defaultOpen={ true }>
                    <FCVolumeSourceDetails resourceData={resourceData.fc } />
                </Container>
            )}

            {hasValue(resourceData.flexVolume) && (
                <Container title="Flex Volume" collapsible defaultOpen={ true }>
                    <FlexPersistentVolumeSourceDetails resourceData={resourceData.flexVolume } />
                </Container>
            )}

            {hasValue(resourceData.flocker) && (
                <Container title="Flocker" collapsible defaultOpen={ true }>
                    <FlockerVolumeSourceDetails resourceData={resourceData.flocker } />
                </Container>
            )}

            {hasValue(resourceData.gcePersistentDisk) && (
                <Container title="Gce Persistent Disk" collapsible defaultOpen={ true }>
                    <GCEPersistentDiskVolumeSourceDetails resourceData={resourceData.gcePersistentDisk } />
                </Container>
            )}

            {hasValue(resourceData.glusterfs) && (
                <Container title="Glusterfs" collapsible defaultOpen={ true }>
                    <GlusterfsPersistentVolumeSourceDetails resourceData={resourceData.glusterfs } />
                </Container>
            )}

            {hasValue(resourceData.hostPath) && (
                <Container title="Host Path" collapsible defaultOpen={ true }>
                    <HostPathVolumeSourceDetails resourceData={resourceData.hostPath } />
                </Container>
            )}

            {hasValue(resourceData.iscsi) && (
                <Container title="Iscsi" collapsible defaultOpen={ true }>
                    <ISCSIPersistentVolumeSourceDetails resourceData={resourceData.iscsi } />
                </Container>
            )}

            {hasValue(resourceData.local) && (
                <Container title="Local" collapsible defaultOpen={ true }>
                    <LocalVolumeSourceDetails resourceData={resourceData.local } />
                </Container>
            )}

            {hasValue(resourceData.nfs) && (
                <Container title="Nfs" collapsible defaultOpen={ true }>
                    <NFSVolumeSourceDetails resourceData={resourceData.nfs } />
                </Container>
            )}

            {hasValue(resourceData.nodeAffinity) && (
                <Container title="Node Affinity" collapsible defaultOpen={ true }>
                    <VolumeNodeAffinityDetails resourceData={resourceData.nodeAffinity } />
                </Container>
            )}

            {hasValue(resourceData.photonPersistentDisk) && (
                <Container title="Photon Persistent Disk" collapsible defaultOpen={ true }>
                    <PhotonPersistentDiskVolumeSourceDetails resourceData={resourceData.photonPersistentDisk } />
                </Container>
            )}

            {hasValue(resourceData.portworxVolume) && (
                <Container title="Portworx Volume" collapsible defaultOpen={ true }>
                    <PortworxVolumeSourceDetails resourceData={resourceData.portworxVolume } />
                </Container>
            )}

            {hasValue(resourceData.quobyte) && (
                <Container title="Quobyte" collapsible defaultOpen={ true }>
                    <QuobyteVolumeSourceDetails resourceData={resourceData.quobyte } />
                </Container>
            )}

            {hasValue(resourceData.rbd) && (
                <Container title="Rbd" collapsible defaultOpen={ true }>
                    <RBDPersistentVolumeSourceDetails resourceData={resourceData.rbd } />
                </Container>
            )}

            {hasValue(resourceData.scaleIO) && (
                <Container title="Scale IO" collapsible defaultOpen={ true }>
                    <ScaleIOPersistentVolumeSourceDetails resourceData={resourceData.scaleIO } />
                </Container>
            )}

            {hasValue(resourceData.storageos) && (
                <Container title="Storageos" collapsible defaultOpen={ true }>
                    <StorageOSPersistentVolumeSourceDetails resourceData={resourceData.storageos } />
                </Container>
            )}

            {hasValue(resourceData.vsphereVolume) && (
                <Container title="Vsphere Volume" collapsible defaultOpen={ true }>
                    <VsphereVirtualDiskVolumeSourceDetails resourceData={resourceData.vsphereVolume } />
                </Container>
            )}

        </>
    )
}
