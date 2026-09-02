import { PanelGrid } from "@components/layout/panel";
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
    // Transform the Capacity object into an array of PanelGridItem objects
    const capacityItems = resourceData.capacity
        ? Object.entries(resourceData.capacity).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(capacityItems.length > 0);
        // Check simple properties
        checks.push([resourceData.persistentVolumeReclaimPolicy, resourceData.storageClassName, resourceData.volumeAttributesClassName, resourceData.volumeMode].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.awsElasticBlockStore, resourceData.azureDisk, resourceData.azureFile, resourceData.cephfs, resourceData.cinder, resourceData.claimRef, resourceData.csi, resourceData.fc, resourceData.flexVolume, resourceData.flocker, resourceData.gcePersistentDisk, resourceData.glusterfs, resourceData.hostPath, resourceData.iscsi, resourceData.local, resourceData.nfs, resourceData.nodeAffinity, resourceData.photonPersistentDisk, resourceData.portworxVolume, resourceData.quobyte, resourceData.rbd, resourceData.scaleIO, resourceData.storageos, resourceData.vsphereVolume].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Capacity"
                items={ capacityItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Persistent Volume Reclaim Policy", value: resourceData.persistentVolumeReclaimPolicy || '-' },
                    { label: "Storage Class Name", value: resourceData.storageClassName || '-' },
                    { label: "Volume Attributes Class Name", value: resourceData.volumeAttributesClassName || '-' },
                    { label: "Volume Mode", value: resourceData.volumeMode || '-' }
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
                    <AzureFilePersistentVolumeSourceDetails resourceData={ resourceData.azureFile } />
                </Container>
            )}

            {resourceData.cephfs && (
                <Container title="Cephfs">
                    <CephFSPersistentVolumeSourceDetails resourceData={ resourceData.cephfs } />
                </Container>
            )}

            {resourceData.cinder && (
                <Container title="Cinder">
                    <CinderPersistentVolumeSourceDetails resourceData={ resourceData.cinder } />
                </Container>
            )}

            {resourceData.claimRef && (
                <Container title="Claim Ref">
                    <ObjectReferenceDetails resourceData={ resourceData.claimRef } />
                </Container>
            )}

            {resourceData.csi && (
                <Container title="Csi">
                    <CSIPersistentVolumeSourceDetails resourceData={ resourceData.csi } />
                </Container>
            )}

            {resourceData.fc && (
                <Container title="Fc">
                    <FCVolumeSourceDetails resourceData={ resourceData.fc } />
                </Container>
            )}

            {resourceData.flexVolume && (
                <Container title="Flex Volume">
                    <FlexPersistentVolumeSourceDetails resourceData={ resourceData.flexVolume } />
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

            {resourceData.glusterfs && (
                <Container title="Glusterfs">
                    <GlusterfsPersistentVolumeSourceDetails resourceData={ resourceData.glusterfs } />
                </Container>
            )}

            {resourceData.hostPath && (
                <Container title="Host Path">
                    <HostPathVolumeSourceDetails resourceData={ resourceData.hostPath } />
                </Container>
            )}

            {resourceData.iscsi && (
                <Container title="Iscsi">
                    <ISCSIPersistentVolumeSourceDetails resourceData={ resourceData.iscsi } />
                </Container>
            )}

            {resourceData.local && (
                <Container title="Local">
                    <LocalVolumeSourceDetails resourceData={ resourceData.local } />
                </Container>
            )}

            {resourceData.nfs && (
                <Container title="Nfs">
                    <NFSVolumeSourceDetails resourceData={ resourceData.nfs } />
                </Container>
            )}

            {resourceData.nodeAffinity && (
                <Container title="Node Affinity">
                    <VolumeNodeAffinityDetails resourceData={ resourceData.nodeAffinity } />
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

            {resourceData.quobyte && (
                <Container title="Quobyte">
                    <QuobyteVolumeSourceDetails resourceData={ resourceData.quobyte } />
                </Container>
            )}

            {resourceData.rbd && (
                <Container title="Rbd">
                    <RBDPersistentVolumeSourceDetails resourceData={ resourceData.rbd } />
                </Container>
            )}

            {resourceData.scaleIO && (
                <Container title="Scale IO">
                    <ScaleIOPersistentVolumeSourceDetails resourceData={ resourceData.scaleIO } />
                </Container>
            )}

            {resourceData.storageos && (
                <Container title="Storageos">
                    <StorageOSPersistentVolumeSourceDetails resourceData={ resourceData.storageos } />
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