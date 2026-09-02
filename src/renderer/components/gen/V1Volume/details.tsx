import { PanelGrid } from "@components/layout/panel";
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

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.awsElasticBlockStore, resourceData.azureDisk, resourceData.azureFile, resourceData.cephfs, resourceData.cinder, resourceData.configMap, resourceData.csi, resourceData.downwardAPI, resourceData.emptyDir, resourceData.ephemeral, resourceData.fc, resourceData.flexVolume, resourceData.flocker, resourceData.gcePersistentDisk, resourceData.gitRepo, resourceData.glusterfs, resourceData.hostPath, resourceData.iscsi, resourceData.nfs, resourceData.persistentVolumeClaim, resourceData.photonPersistentDisk, resourceData.portworxVolume, resourceData.projected, resourceData.quobyte, resourceData.rbd, resourceData.scaleIO, resourceData.secret, resourceData.storageos, resourceData.vsphereVolume].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name }
                ]}
                columns={1}
            />

            {resourceData.awsElasticBlockStore && (
                <Container title="Aws Elastic Block Store">
                    <AWSElasticBlockStoreVolumeSourceDetails resourceData={ resourceData.awsElasticBlockStore } />
                </Container>
            )}

            {resourceData.azureDisk && (
                <Container title="Azure Disk">
                    <AzureDiskVolumeSourceDetails resourceData={ resourceData.azureDisk } />
                </Container>
            )}

            {resourceData.azureFile && (
                <Container title="Azure File">
                    <AzureFileVolumeSourceDetails resourceData={ resourceData.azureFile } />
                </Container>
            )}

            {resourceData.cephfs && (
                <Container title="Cephfs">
                    <CephFSVolumeSourceDetails resourceData={ resourceData.cephfs } />
                </Container>
            )}

            {resourceData.cinder && (
                <Container title="Cinder">
                    <CinderVolumeSourceDetails resourceData={ resourceData.cinder } />
                </Container>
            )}

            {resourceData.configMap && (
                <Container title="Config Map">
                    <ConfigMapVolumeSourceDetails resourceData={ resourceData.configMap } />
                </Container>
            )}

            {resourceData.csi && (
                <Container title="Csi">
                    <CSIVolumeSourceDetails resourceData={ resourceData.csi } />
                </Container>
            )}

            {resourceData.downwardAPI && (
                <Container title="Downward API">
                    <DownwardAPIVolumeSourceDetails resourceData={ resourceData.downwardAPI } />
                </Container>
            )}

            {resourceData.emptyDir && (
                <Container title="Empty Dir">
                    <EmptyDirVolumeSourceDetails resourceData={ resourceData.emptyDir } />
                </Container>
            )}

            {resourceData.ephemeral && (
                <Container title="Ephemeral">
                    <EphemeralVolumeSourceDetails resourceData={ resourceData.ephemeral } />
                </Container>
            )}

            {resourceData.fc && (
                <Container title="Fc">
                    <FCVolumeSourceDetails resourceData={ resourceData.fc } />
                </Container>
            )}

            {resourceData.flexVolume && (
                <Container title="Flex Volume">
                    <FlexVolumeSourceDetails resourceData={ resourceData.flexVolume } />
                </Container>
            )}

            {resourceData.flocker && (
                <Container title="Flocker">
                    <FlockerVolumeSourceDetails resourceData={ resourceData.flocker } />
                </Container>
            )}

            {resourceData.gcePersistentDisk && (
                <Container title="Gce Persistent Disk">
                    <GCEPersistentDiskVolumeSourceDetails resourceData={ resourceData.gcePersistentDisk } />
                </Container>
            )}

            {resourceData.gitRepo && (
                <Container title="Git Repo">
                    <GitRepoVolumeSourceDetails resourceData={ resourceData.gitRepo } />
                </Container>
            )}

            {resourceData.glusterfs && (
                <Container title="Glusterfs">
                    <GlusterfsVolumeSourceDetails resourceData={ resourceData.glusterfs } />
                </Container>
            )}

            {resourceData.hostPath && (
                <Container title="Host Path">
                    <HostPathVolumeSourceDetails resourceData={ resourceData.hostPath } />
                </Container>
            )}

            {resourceData.iscsi && (
                <Container title="Iscsi">
                    <ISCSIVolumeSourceDetails resourceData={ resourceData.iscsi } />
                </Container>
            )}

            {resourceData.nfs && (
                <Container title="Nfs">
                    <NFSVolumeSourceDetails resourceData={ resourceData.nfs } />
                </Container>
            )}

            {resourceData.persistentVolumeClaim && (
                <Container title="Persistent Volume Claim">
                    <PersistentVolumeClaimVolumeSourceDetails resourceData={ resourceData.persistentVolumeClaim } />
                </Container>
            )}

            {resourceData.photonPersistentDisk && (
                <Container title="Photon Persistent Disk">
                    <PhotonPersistentDiskVolumeSourceDetails resourceData={ resourceData.photonPersistentDisk } />
                </Container>
            )}

            {resourceData.portworxVolume && (
                <Container title="Portworx Volume">
                    <PortworxVolumeSourceDetails resourceData={ resourceData.portworxVolume } />
                </Container>
            )}

            {resourceData.projected && (
                <Container title="Projected">
                    <ProjectedVolumeSourceDetails resourceData={ resourceData.projected } />
                </Container>
            )}

            {resourceData.quobyte && (
                <Container title="Quobyte">
                    <QuobyteVolumeSourceDetails resourceData={ resourceData.quobyte } />
                </Container>
            )}

            {resourceData.rbd && (
                <Container title="Rbd">
                    <RBDVolumeSourceDetails resourceData={ resourceData.rbd } />
                </Container>
            )}

            {resourceData.scaleIO && (
                <Container title="Scale IO">
                    <ScaleIOVolumeSourceDetails resourceData={ resourceData.scaleIO } />
                </Container>
            )}

            {resourceData.secret && (
                <Container title="Secret">
                    <SecretVolumeSourceDetails resourceData={ resourceData.secret } />
                </Container>
            )}

            {resourceData.storageos && (
                <Container title="Storageos">
                    <StorageOSVolumeSourceDetails resourceData={ resourceData.storageos } />
                </Container>
            )}

            {resourceData.vsphereVolume && (
                <Container title="Vsphere Volume">
                    <VsphereVirtualDiskVolumeSourceDetails resourceData={ resourceData.vsphereVolume } />
                </Container>
            )}

        </>
    )
}