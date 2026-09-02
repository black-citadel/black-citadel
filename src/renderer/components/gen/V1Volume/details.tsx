import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Volume } from "@kubernetes/client-node";
import { AWSElasticBlockStoreVolumeSourceDetails } from "../V1AWSElasticBlockStoreVolumeSource/details";
import { AzureDiskVolumeSourceDetails } from "../V1AzureDiskVolumeSource/details";
import { AzureFileVolumeSourceDetails } from "../V1AzureFileVolumeSource/details";
import { CephFSVolumeSourceDetails } from "../V1CephFSVolumeSource/details";
import { CinderVolumeSourceDetails } from "../V1CinderVolumeSource/details";
import { ConfigMapVolumeSourceDetails } from "../V1ConfigMapVolumeSource/details";
import { CSIVolumeSourceDetails } from "../V1CSIVolumeSource/details";
import { DownwardAPIVolumeSourceDetails } from "../V1DownwardAPIVolumeSource/details";
import { EmptyDirVolumeSourceDetails } from "../V1EmptyDirVolumeSource/details";
import { EphemeralVolumeSourceDetails } from "../V1EphemeralVolumeSource/details";
import { FCVolumeSourceDetails } from "../V1FCVolumeSource/details";
import { FlexVolumeSourceDetails } from "../V1FlexVolumeSource/details";
import { FlockerVolumeSourceDetails } from "../V1FlockerVolumeSource/details";
import { GCEPersistentDiskVolumeSourceDetails } from "../V1GCEPersistentDiskVolumeSource/details";
import { GitRepoVolumeSourceDetails } from "../V1GitRepoVolumeSource/details";
import { GlusterfsVolumeSourceDetails } from "../V1GlusterfsVolumeSource/details";
import { HostPathVolumeSourceDetails } from "../V1HostPathVolumeSource/details";
import { ISCSIVolumeSourceDetails } from "../V1ISCSIVolumeSource/details";
import { NFSVolumeSourceDetails } from "../V1NFSVolumeSource/details";
import { PersistentVolumeClaimVolumeSourceDetails } from "../V1PersistentVolumeClaimVolumeSource/details";
import { PhotonPersistentDiskVolumeSourceDetails } from "../V1PhotonPersistentDiskVolumeSource/details";
import { PortworxVolumeSourceDetails } from "../V1PortworxVolumeSource/details";
import { ProjectedVolumeSourceDetails } from "../V1ProjectedVolumeSource/details";
import { QuobyteVolumeSourceDetails } from "../V1QuobyteVolumeSource/details";
import { RBDVolumeSourceDetails } from "../V1RBDVolumeSource/details";
import { ScaleIOVolumeSourceDetails } from "../V1ScaleIOVolumeSource/details";
import { SecretVolumeSourceDetails } from "../V1SecretVolumeSource/details";
import { StorageOSVolumeSourceDetails } from "../V1StorageOSVolumeSource/details";
import { VsphereVirtualDiskVolumeSourceDetails } from "../V1VsphereVirtualDiskVolumeSource/details";

export const VolumeDetails = ({ resourceData }: { resourceData: V1Volume }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.awsElasticBlockStore),
        hasValue(resourceData.azureDisk),
        hasValue(resourceData.azureFile),
        hasValue(resourceData.cephfs),
        hasValue(resourceData.cinder),
        hasValue(resourceData.configMap),
        hasValue(resourceData.csi),
        hasValue(resourceData.downwardAPI),
        hasValue(resourceData.emptyDir),
        hasValue(resourceData.ephemeral),
        hasValue(resourceData.fc),
        hasValue(resourceData.flexVolume),
        hasValue(resourceData.flocker),
        hasValue(resourceData.gcePersistentDisk),
        hasValue(resourceData.gitRepo),
        hasValue(resourceData.glusterfs),
        hasValue(resourceData.hostPath),
        hasValue(resourceData.iscsi),
        hasValue(resourceData.nfs),
        hasValue(resourceData.persistentVolumeClaim),
        hasValue(resourceData.photonPersistentDisk),
        hasValue(resourceData.portworxVolume),
        hasValue(resourceData.projected),
        hasValue(resourceData.quobyte),
        hasValue(resourceData.rbd),
        hasValue(resourceData.scaleIO),
        hasValue(resourceData.secret),
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
                    { label: "Name", value: resourceData.name, description: "name of the volume." },
                ]}
            />

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
                    <AzureFileVolumeSourceDetails resourceData={resourceData.azureFile } />
                </Container>
            )}

            {hasValue(resourceData.cephfs) && (
                <Container title="Cephfs" collapsible defaultOpen={ true }>
                    <CephFSVolumeSourceDetails resourceData={resourceData.cephfs } />
                </Container>
            )}

            {hasValue(resourceData.cinder) && (
                <Container title="Cinder" collapsible defaultOpen={ true }>
                    <CinderVolumeSourceDetails resourceData={resourceData.cinder } />
                </Container>
            )}

            {hasValue(resourceData.configMap) && (
                <Container title="Config Map" collapsible defaultOpen={ true }>
                    <ConfigMapVolumeSourceDetails resourceData={resourceData.configMap } />
                </Container>
            )}

            {hasValue(resourceData.csi) && (
                <Container title="Csi" collapsible defaultOpen={ true }>
                    <CSIVolumeSourceDetails resourceData={resourceData.csi } />
                </Container>
            )}

            {hasValue(resourceData.downwardAPI) && (
                <Container title="Downward API" collapsible defaultOpen={ true }>
                    <DownwardAPIVolumeSourceDetails resourceData={resourceData.downwardAPI } />
                </Container>
            )}

            {hasValue(resourceData.emptyDir) && (
                <Container title="Empty Dir" collapsible defaultOpen={ true }>
                    <EmptyDirVolumeSourceDetails resourceData={resourceData.emptyDir } />
                </Container>
            )}

            {hasValue(resourceData.ephemeral) && (
                <Container title="Ephemeral" collapsible defaultOpen={ true }>
                    <EphemeralVolumeSourceDetails resourceData={resourceData.ephemeral } />
                </Container>
            )}

            {hasValue(resourceData.fc) && (
                <Container title="Fc" collapsible defaultOpen={ true }>
                    <FCVolumeSourceDetails resourceData={resourceData.fc } />
                </Container>
            )}

            {hasValue(resourceData.flexVolume) && (
                <Container title="Flex Volume" collapsible defaultOpen={ true }>
                    <FlexVolumeSourceDetails resourceData={resourceData.flexVolume } />
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

            {hasValue(resourceData.gitRepo) && (
                <Container title="Git Repo" collapsible defaultOpen={ true }>
                    <GitRepoVolumeSourceDetails resourceData={resourceData.gitRepo } />
                </Container>
            )}

            {hasValue(resourceData.glusterfs) && (
                <Container title="Glusterfs" collapsible defaultOpen={ true }>
                    <GlusterfsVolumeSourceDetails resourceData={resourceData.glusterfs } />
                </Container>
            )}

            {hasValue(resourceData.hostPath) && (
                <Container title="Host Path" collapsible defaultOpen={ true }>
                    <HostPathVolumeSourceDetails resourceData={resourceData.hostPath } />
                </Container>
            )}

            {hasValue(resourceData.iscsi) && (
                <Container title="Iscsi" collapsible defaultOpen={ true }>
                    <ISCSIVolumeSourceDetails resourceData={resourceData.iscsi } />
                </Container>
            )}

            {hasValue(resourceData.nfs) && (
                <Container title="Nfs" collapsible defaultOpen={ true }>
                    <NFSVolumeSourceDetails resourceData={resourceData.nfs } />
                </Container>
            )}

            {hasValue(resourceData.persistentVolumeClaim) && (
                <Container title="Persistent Volume Claim" collapsible defaultOpen={ true }>
                    <PersistentVolumeClaimVolumeSourceDetails resourceData={resourceData.persistentVolumeClaim } />
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

            {hasValue(resourceData.projected) && (
                <Container title="Projected" collapsible defaultOpen={ true }>
                    <ProjectedVolumeSourceDetails resourceData={resourceData.projected } />
                </Container>
            )}

            {hasValue(resourceData.quobyte) && (
                <Container title="Quobyte" collapsible defaultOpen={ true }>
                    <QuobyteVolumeSourceDetails resourceData={resourceData.quobyte } />
                </Container>
            )}

            {hasValue(resourceData.rbd) && (
                <Container title="Rbd" collapsible defaultOpen={ true }>
                    <RBDVolumeSourceDetails resourceData={resourceData.rbd } />
                </Container>
            )}

            {hasValue(resourceData.scaleIO) && (
                <Container title="Scale IO" collapsible defaultOpen={ true }>
                    <ScaleIOVolumeSourceDetails resourceData={resourceData.scaleIO } />
                </Container>
            )}

            {hasValue(resourceData.secret) && (
                <Container title="Secret" collapsible defaultOpen={ true }>
                    <SecretVolumeSourceDetails resourceData={resourceData.secret } />
                </Container>
            )}

            {hasValue(resourceData.storageos) && (
                <Container title="Storageos" collapsible defaultOpen={ true }>
                    <StorageOSVolumeSourceDetails resourceData={resourceData.storageos } />
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
